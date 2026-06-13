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
            className="absolute bg-red-400 rounded p-1 text-white text-xs flex flex-col justify-center cursor-pointer z-10 shadow overflow-hidden whitespace-nowrap"
            style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }}
            onClick={() => alert(`Урок с ${lesson.student}, длительность ${lesson.duration} мин`)}
        >
            <button
                className="absolute top-0.5 right-0.5 bg-transparent border-none text-white text-sm cursor-pointer font-bold z-20 hover:bg-white/20 rounded"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lesson.id);
                }}
            >
                ✖
            </button>
            <div className="font-bold">{lesson.student}</div>
            <div className="text-[0.7rem] opacity-90">{lesson.duration} мин</div>
        </div>
    );
}

export default LessonBlock;