import { useCallback } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import styles from './Calendar.module.css';

function CalendarHeader({ currentRange }: { currentRange: string }) {
    const { view, setView, goPrev, goNext } = useCalendarStore();
    const handleViewChange = useCallback((v: 'day' | '3days' | 'week') => setView(v), [setView]);

    const views = ['day', '3days', 'week'] as const;
    const viewLabels = { day: 'День', '3days': '3 дня', week: 'Неделя' };

    return (
        <div className={styles.header}>
            <div>
                <button className={styles.navButton} onClick={goPrev}>←</button>
                <button className={styles.navButton} onClick={goNext}>→</button>
            </div>
            <div className={styles.currentRange}>{currentRange}</div>
            <div className={styles.viewButtons}>
                {views.map(v => (
                    <button
                        key={v}
                        className={`${styles.viewButton} ${view === v ? styles.viewButtonActive : styles.viewButtonInactive}`}
                        onClick={() => handleViewChange(v)}
                    >
                        {viewLabels[v]}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CalendarHeader;