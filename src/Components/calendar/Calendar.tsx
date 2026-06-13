import { useMemo, useEffect } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { getDaysForView } from '../../utils/getDaysForView';

function Calendar() {
    const { view, startDate, schedule, lessons, setView, addSignUp } = useCalendarStore();

    const currentRange = useMemo(() => {
        const days = getDaysForView(view, startDate);
        if (days.length === 0) return '';
        const start = days[0];
        const end = days[days.length - 1];
        const format = (d: Date) => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        return `${format(start)} – ${format(end)}`;
    }, [view, startDate]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) setView('day');
            else if (width < 1024) setView('3days');
            else setView('week');
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setView]);

    const handleAddSignUp = (start: Date, end: Date, userName: string) => {
        const newSignUp = {
            id: Date.now(),
            duration: 30,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            student: userName,
        };
        addSignUp(newSignUp);
    };

    const handleSlotSelect = (slot: { start: Date; end: Date }) => {
        const userName = window.prompt('Введите ваше имя для записи:');
        if (userName && userName.trim()) {
            handleAddSignUp(slot.start, slot.end, userName.trim());
            alert(`Вы успешно записаны, ${userName}!`);
        } else {
            alert('Запись отменена (имя не указано)');
        }
    };

    return (
        <div className="p-4 max-w-full">
            <CalendarHeader currentRange={currentRange} />
            <CalendarGrid
                view={view}
                startDate={startDate}
                schedule={schedule}
                lessons={lessons}
                onSlotClick={handleSlotSelect}
            />
        </div>
    );
}

export default Calendar;