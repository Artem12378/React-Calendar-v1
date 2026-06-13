import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { getLessonForSlot } from '../../utils/getLessonForSlot';
import type { Lesson, ScheduleInterval, TimeSlot, View } from '../../types/calendar';
import { useCalendarStore } from '../../store/calendarStore';
import { getDaysForView } from '../../utils/getDaysForView';
import { generateTimeSlots } from '../../utils/generateTimeSlots';
import { isWorkingHour } from '../../utils/isWorkingHour';
import TimeSlotRow from './TimeSlotRow';
import LessonBlock from './LessonBlock';

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

    const getTimeKey = (slot: Date) => `${slot.getUTCHours()}:${slot.getUTCMinutes()}`;

    useLayoutEffect(() => {
        const updatePositions = () => {
            if (!gridRef.current) return;
            const newPositions: typeof lessonPositions = [];

            lessons.forEach((lesson) => {
                const lessonStart = new Date(lesson.startTime);
                const lessonEnd = new Date(lesson.endTime);
                const durationMinutes = (lessonEnd.getTime() - lessonStart.getTime()) / 60000;
                const rowSpan = durationMinutes / 30;

                const dayIndex = days.findIndex((day) => day.toDateString() === lessonStart.toDateString());
                if (dayIndex === -1) return;

                const slotIndex = timeSlots.findIndex((slot) => {
                    const candidate = new Date(lessonStart);
                    candidate.setUTCHours(slot.getUTCHours(), slot.getUTCMinutes(), 0, 0);
                    return candidate.getTime() === lessonStart.getTime();
                });
                if (slotIndex === -1) return;

                const firstCell = gridRef.current!.querySelector(
                    `[data-day="${dayIndex}"][data-slot="${slotIndex}"]`
                );
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
        };

        updatePositions();
        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);
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

    const deleteLesson = (id: number) => {
        const updatedLessons = lessons.filter((l) => l.id !== id);
        useCalendarStore.getState().setLessons(updatedLessons);
    };

    return (
        <div className="overflow-x-auto relative">
            <div
                ref={gridRef}
                className="grid bg-gray-200 rounded-lg overflow-hidden gap-[1px]"
                style={{ gridTemplateColumns: gridCols }}
            >
                <div className="bg-gray-100 p-2 text-center font-semibold">Время</div>
                {days.map((day) => (
                    <div key={day.toISOString()} className="bg-gray-100 p-2 text-center font-semibold">
                        {day.toLocaleDateString('ru-RU', { weekday: 'long' })}
                        <div className="text-xs text-gray-500">
                            {day.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                ))}

                {timeSlots.map((slotStart, rowIdx) => (
                    <TimeSlotRow
                        key={getTimeKey(slotStart)}
                        slotStart={slotStart}
                        rowIdx={rowIdx}
                        days={days}
                        schedule={schedule}
                        lessons={lessons}
                        onSlotClick={onSlotClick}
                        onCellClick={handleCellClick}
                    />
                ))}
            </div>

            {lessonPositions.map(({ lesson, top, left, width, height }) => (
                <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    top={top}
                    left={left}
                    width={width}
                    height={height}
                    onDelete={deleteLesson}
                />
            ))}
        </div>
    );
}

export default CalendarGrid;