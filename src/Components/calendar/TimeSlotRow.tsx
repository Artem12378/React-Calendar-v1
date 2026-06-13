// TimeSlotRow.tsx
import { Fragment } from 'react';
import styles from './Calendar.module.css';
import type { Lesson, ScheduleInterval } from '../../types/calendar';
import {formatTime} from "../../utils/formatTime.ts";
import {isWorkingHour} from "../../utils/isWorkingHour.ts";
import {getLessonForSlot} from "../../utils/getLessonForSlot.ts";

type TimeSlotRowProps = {
    slotStart: Date;
    rowIdx: number;
    days: Date[];
    schedule: ScheduleInterval[];
    lessons: Lesson[];
    onSlotClick?: (slot: { start: Date; end: Date }) => void;
    onCellClick: (cellStart: Date, cellEnd: Date) => void;   // 👈 добавляем
};

function TimeSlotRow({ slotStart, rowIdx, days, schedule, lessons, onCellClick }: TimeSlotRowProps) {
    const timeKey = `${slotStart.getUTCHours()}:${slotStart.getUTCMinutes()}`;

    return (
        <Fragment key={timeKey}>
            <div className={styles.timeLabel}>{formatTime(slotStart)}</div>
            {days.map((day, colIdx) => {
                const cellStart = new Date(day);
                let content = null;
                cellStart.setHours(slotStart.getHours(), slotStart.getMinutes(), 0, 0);
                const cellEnd = new Date(cellStart.getTime() + 30 * 60000);
                const working = isWorkingHour(cellStart, schedule);
                const lesson = getLessonForSlot(cellStart, cellEnd, lessons);

                let cellClass = styles.cell;
                if (lesson) cellClass += ` ${styles.cellBooked}`;
                else if (working) {
                    cellClass += ` ${styles.cellAvailable}`;
                    content = <div className={styles.bookingText}>Записаться</div>;
                } else cellClass += ` ${styles.cellUnavailable}`;

                const cellKey = `${day.toISOString()}-${timeKey}`;
                return (
                    <div
                        key={cellKey}
                        data-day={colIdx}
                        data-slot={rowIdx}
                        className={cellClass}
                        onClick={() => onCellClick(cellStart, cellEnd)}   // 👈 используем переданный колбэк
                    >
                        {content}
                    </div>
                );
            })}
        </Fragment>
    );
}

export default TimeSlotRow;