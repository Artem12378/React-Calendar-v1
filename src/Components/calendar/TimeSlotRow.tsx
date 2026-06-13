import { Fragment } from 'react';
import { formatTime } from '../../utils/formatTime';
import { isWorkingHour } from '../../utils/isWorkingHour';
import { getLessonForSlot } from '../../utils/getLessonForSlot';
import type { Lesson, ScheduleInterval } from '../../types/calendar';

type TimeSlotRowProps = {
    slotStart: Date;
    rowIdx: number;
    days: Date[];
    schedule: ScheduleInterval[];
    lessons: Lesson[];
    onSlotClick?: (slot: { start: Date; end: Date }) => void;
    onCellClick: (cellStart: Date, cellEnd: Date) => void;
};

function TimeSlotRow({ slotStart, rowIdx, days, schedule, lessons, onCellClick }: TimeSlotRowProps) {
    const timeKey = `${slotStart.getUTCHours()}:${slotStart.getUTCMinutes()}`;

    return (
        <Fragment key={timeKey}>
            <div className="bg-white p-2 text-sm text-gray-500 text-center border-r min-h-[32px] flex items-center justify-center">
                {formatTime(slotStart)}
            </div>
            {days.map((day, colIdx) => {
                const cellStart = new Date(day);
                let content = null;
                cellStart.setHours(slotStart.getHours(), slotStart.getMinutes(), 0, 0);
                const cellEnd = new Date(cellStart.getTime() + 30 * 60000);
                const working = isWorkingHour(cellStart, schedule);
                const lesson = getLessonForSlot(cellStart, cellEnd, lessons);

                let cellClass = 'transition-colors min-h-[32px]';
                if (lesson) {
                    cellClass += ' bg-red-300';
                } else if (working) {
                    cellClass += ' bg-green-200 hover:bg-green-300 cursor-pointer';
                    content = (
                        <div className="flex items-center justify-center h-full text-xs font-medium text-green-800 bg-inherit rounded pointer-events-none">
                            Записаться
                        </div>
                    );
                } else {
                    cellClass += ' bg-gray-100';
                }

                const cellKey = `${day.toISOString()}-${timeKey}`;
                return (
                    <div
                        key={cellKey}
                        data-day={colIdx}
                        data-slot={rowIdx}
                        className={cellClass}
                        onClick={() => onCellClick(cellStart, cellEnd)}
                    >
                        {content}
                    </div>
                );
            })}
        </Fragment>
    );
}

export default TimeSlotRow;