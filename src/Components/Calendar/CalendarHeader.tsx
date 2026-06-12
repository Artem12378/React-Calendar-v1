import styles from './Calendar.module.css';
import type {View} from "../../types/calendar.ts";

type HeaderProps = {
    currentRange: string;
    view: View;
    onViewChange: (view: View) => void;
    onPrev: () => void;
    onNext: () => void;
};

const views: View[] = ['day', '3days', 'week'];
const viewLabels = { day: 'День', '3days': '3 дня', week: 'Неделя' };

function CalendarHeader({ currentRange, view, onViewChange, onPrev, onNext }: HeaderProps) {
    return (
        <div className={styles.header}>
            <div>
                <button className={styles.navButton} onClick={onPrev}>←</button>
                <button className={styles.navButton} onClick={onNext}>→</button>
            </div>
            <div className={styles.currentRange}>{currentRange}</div>
            <div className={styles.viewButtons}>
                {views.map(v => (
                    <button
                        key={v}
                        className={view === v ? styles.viewButtonActive : styles.viewButtonInactive}
                        onClick={() => onViewChange(v)}
                    >
                        {viewLabels[v]}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CalendarHeader;