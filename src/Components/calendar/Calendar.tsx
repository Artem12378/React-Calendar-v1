import {  useMemo, useEffect } from 'react';
import CalendarHeader from './CalendarHeader.tsx';
import CalendarGrid from './CalendarGrid';
import styles from './Calendar.module.css';
import {useCalendarStore} from "../../store/calendarStore.ts";
import type {Lesson} from "../../types/calendar.ts";
import {getDaysForView} from "../../utils/getDaysForView.ts";

function Calendar() {
    const { view, startDate, schedule, lessons, setView,addSignUp } = useCalendarStore();


    // Адаптивная смена вида по ширине экрана


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
    }, []);

    const handleAddSignUp = (start:Date, end:Date, userName:string) => {
        const newSignUp: Lesson = {
            id: Date.now(),
            duration: 30,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            student: userName,
        }
        return addSignUp(newSignUp);
    }


    const handleSlotSelect = (slot: { start: Date; end: Date }) => {
        const userName = window.prompt('Введите ваше имя для записи:');
        if (userName && userName.trim()) {
            // Вызываем вашу функцию записи, передавая имя
            handleAddSignUp(slot.start, slot.end, userName.trim());
            alert(`Вы успешно записаны, ${userName}!`);
        } else {
            alert('Запись отменена (имя не указано)');
        }
    };

    return (
        <div className={styles.calendarContainer}>
            <CalendarHeader
                currentRange={currentRange}
            />
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