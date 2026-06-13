import styles from './Calendar.module.css';
import type { Lesson } from '../../types/calendar';

type LessonBlockProps = {
    lesson: Lesson;
    top: number;
    left: number;
    width: number;
    height: number;
    onDelete: (id: number) => void;
};

function LessonBlock({ lesson, top, left, width, height, onDelete }: LessonBlockProps) {
    return (
        <div
            className={styles.lessonOverlay}
            style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }}
            onClick={() => alert(`Урок с ${lesson.student}, длительность ${lesson.duration} мин`)}
        >
            <button
                className={styles.deleteLessonBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lesson.id);
                }}
            >
                ✖
            </button>
            <div className={styles.lessonStudent}>{lesson.student}</div>
            <div className={styles.lessonDuration}>{lesson.duration} мин</div>
        </div>
    );
}

export default LessonBlock;