import { useState, useMemo, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { getDaysForView } from '../../utils/calendarUtils';
import styles from './Calendar.module.css';
import type {CalendarProps, View} from "../../types/calendar.ts";

function Calendar({
                      view: initialView = 'week',
                      startDate: initialStartDate = new Date(),
                      schedule = [],
                      lessons = [],
                      onSlotSelect,
                  }: CalendarProps) {
    const [view, setView] = useState<View>(initialView);
    const [startDate, setStartDate] = useState<Date>(initialStartDate);

    // Адаптивная смена вида по ширине экрана
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

    const currentRange = useMemo(() => {
        const days = getDaysForView(view, startDate);
        if (days.length === 0) return '';
        const start = days[0];
        const end = days[days.length - 1];
        const format = (d: Date) => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        return `${format(start)} – ${format(end)}`;
    }, [view, startDate]);

    const handlePrev = () => {
        const delta = view === 'day' ? 1 : view === '3days' ? 3 : 7;
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() - delta);
        setStartDate(newDate);
    };

    const handleNext = () => {
        const delta = view === 'day' ? 1 : view === '3days' ? 3 : 7;
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + delta);
        setStartDate(newDate);
    };

    return (
        <div className={styles.calendarContainer}>
            <CalendarHeader
                currentRange={currentRange}
                view={view}
                onViewChange={setView}
                onPrev={handlePrev}
                onNext={handleNext}
            />
            <CalendarGrid
                view={view}
                startDate={startDate}
                schedule={schedule}
                lessons={lessons}
                onSlotClick={onSlotSelect}
            />
        </div>
    );
}

export default Calendar;