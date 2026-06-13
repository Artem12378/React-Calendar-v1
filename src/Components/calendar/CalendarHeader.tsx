import { useCallback } from 'react';
import { useCalendarStore } from '../../store/calendarStore';

function CalendarHeader({ currentRange }: { currentRange: string }) {
    const { view, setView, goPrev, goNext } = useCalendarStore();
    const handleViewChange = useCallback((v: 'day' | '3days' | 'week') => setView(v), [setView]);

    const views = ['day', '3days', 'week'] as const;
    const viewLabels = { day: 'День', '3days': '3 дня', week: 'Неделя' };

    return (
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div>
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer border-none"
                    onClick={goPrev}
                >
                    ←
                </button>
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer border-none ml-2"
                    onClick={goNext}
                >
                    →
                </button>
            </div>
            <div className="text-lg font-semibold">{currentRange}</div>
            <div className="flex gap-2">
                {views.map((v) => (
                    <button
                        key={v}
                        className={`px-3 py-1 rounded cursor-pointer border-none transition ${
                            view === v
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
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