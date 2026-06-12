import { useMemo, useRef, useEffect, useState, Fragment } from 'react';
import styles from './Calendar.module.css';
import { getDaysForView, generateTimeSlots, formatTime, isWorkingHour, getLessonForSlot } from '../../utils/calendarUtils';
import type {Lesson, ScheduleInterval, TimeSlot, View} from "../../types/calendar.ts";

type GridProps = {
    view: View;
    startDate: Date;
    schedule: ScheduleInterval[];
    lessons: Lesson[];
    onSlotClick?: (slot: TimeSlot) => void;
};

function CalendarGrid({ view, startDate, schedule, lessons, onSlotClick }: GridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [lessonPositions, setLessonPositions] = useState<
        { lesson: Lesson; top: number; left: number; width: number; height: number }[]
    >([]);

    const days = useMemo(() => getDaysForView(view, startDate), [view, startDate]);
    const timeSlots = useMemo(() => generateTimeSlots(0, 24), []);
    const gridCols = `80px repeat(${days.length}, minmax(100px, 1fr))`;

    useEffect(() => {
        if (!gridRef.current) return;
        const newPositions: typeof lessonPositions = [];

        lessons.forEach(lesson => {
            const lessonStart = new Date(lesson.startTime);
            const lessonEnd = new Date(lesson.endTime);
            const durationMinutes = (lessonEnd.getTime() - lessonStart.getTime()) / 60000;
            const rowSpan = durationMinutes / 30;

            const dayIndex = days.findIndex(day => day.toDateString() === lessonStart.toDateString());
            if (dayIndex === -1) return;


            const slotIndex = timeSlots.findIndex(slot => {
                const candidate = new Date(lessonStart);
                candidate.setHours(slot.getHours(), slot.getMinutes(), 0, 0);
                return candidate.getTime() === lessonStart.getTime();
            });
            if (slotIndex === -1) return;

            const firstCell = gridRef.current!.querySelector(`[data-day="${dayIndex}"][data-slot="${slotIndex}"]`);
            if (firstCell) {
                const rect = firstCell.getBoundingClientRect();
                const gridRect = gridRef.current!.getBoundingClientRect();
                const top = rect.top - gridRect.top;
                const left = rect.left - gridRect.left;
                const width = rect.width;
                const height = rowSpan * rect.height;
                newPositions.push({ lesson, top, left, width, height });
            }
        });
        setLessonPositions(newPositions);
    }, [days, timeSlots, lessons]);

    const handleCellClick = (cellStart: Date, cellEnd: Date) => {
        const working = isWorkingHour(cellStart, schedule);
        const lesson = getLessonForSlot(cellStart, cellEnd, lessons);
        if (lesson) {
            alert(`Урок с ${lesson.student}, длительность ${lesson.duration} мин`);
        } else if (working) {
            onSlotClick?.({ start: cellStart, end: cellEnd });
        }
    };



    return (
        <div className={styles.gridWrapper}>
            <div ref={gridRef} className={styles.grid} style={{ gridTemplateColumns: gridCols, gap: '1px' }}>
                <div className={styles.timeHeader}>Время</div>
                {days.map((day, idx) => (
                    <div key={idx} className={styles.dayHeader}>
                        {day.toLocaleDateString('ru-RU', { weekday: 'short' })}
                        <div className={styles.dayNumber}>
                            {day.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' })}
                        </div>
                    </div>
                ))}

                {timeSlots.map((slotStart, rowIdx) => (

                    <Fragment key={rowIdx}>
                        <div className={styles.timeLabel}>{formatTime(slotStart)}</div>
                        {days.map((day, colIdx) => {
                            const cellStart = new Date(day);
                            cellStart.setHours(slotStart.getHours(), slotStart.getMinutes(), 0, 0);
                            const cellEnd = new Date(cellStart.getTime() + 30 * 60000);
                            const working = isWorkingHour(cellStart, schedule);
                            const lesson = getLessonForSlot(cellStart, cellEnd, lessons);

                            let cellClass = styles.cell;
                            if (lesson) cellClass += ` ${styles.cellBooked}`;
                            else if (working) cellClass += ` ${styles.cellAvailable}`;
                            else cellClass += ` ${styles.cellUnavailable}`;

                            return (
                                <div
                                    key={colIdx}
                                    data-day={colIdx}
                                    data-slot={rowIdx}
                                    className={cellClass}
                                    onClick={() => handleCellClick(cellStart, cellEnd)}
                                />
                            );
                        })}
                    </Fragment>
                ))}
            </div>

            {lessonPositions.map(({ lesson, top, left, width, height }) => (
                <div
                    key={lesson.id}
                    className={styles.lessonOverlay}
                    style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }}
                    onClick={() => alert(`Урок с ${lesson.student}, длительность ${lesson.duration} мин`)}
                >
                    <div className={styles.lessonStudent}>{lesson.student}</div>
                    <div className={styles.lessonDuration}>{lesson.duration} мин</div>
                </div>
            ))}
        </div>
    );
}

export default CalendarGrid;