import type { ScheduleInterval, Lesson } from './types/calendar';
import Calendar from "./Components/Calendar/Calendar.tsx";

const schedule: ScheduleInterval[] = [

    {
        "startTime": "2025-08-23T22:30:00+00:00",
        "endTime": "2025-08-24T02:29:59+00:00"
    },
    {
        "startTime": "2025-08-25T01:30:00+00:00",
        "endTime": "2025-08-25T04:59:59+00:00"
    },
    {
        "startTime": "2025-08-25T11:00:00+00:00",
        "endTime": "2025-08-25T19:29:59+00:00"
    },
    {
        "startTime": "2025-08-27T02:30:00+00:00",
        "endTime": "2025-08-27T06:59:59+00:00"
    },
    {
        "startTime": "2025-08-28T23:00:00+00:00",
        "endTime": "2025-08-29T08:29:59+00:00"
    },
    {
        "startTime": "2025-08-30T22:30:00+00:00",
        "endTime": "2025-08-31T02:29:59+00:00"
    },
    {
        "startTime": "2025-09-01T01:30:00+00:00",
        "endTime": "2025-09-01T04:59:59+00:00"
    },
    {
        "startTime": "2025-09-01T11:00:00+00:00",
        "endTime": "2025-09-01T19:29:59+00:00"
    }

];

const lessons: Lesson[] = [
    {
        id: 1,
        duration: 60,
        startTime: '2025-08-25T13:00:00+00:00',
        endTime: '2025-08-25T14:00:00+00:00',
        student: 'Алексей',
    },
    {
        id: 2,
        duration: 90,
        startTime: '2025-08-25T14:00:00+00:00',
        endTime: '2025-08-25T15:00:00+00:00',
        student: 'Женя',
    },
];


// Функция сдвига времени на +3 часа (UTC → MSK)
/*const toMoscowTime = (isoString: string): string => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString();
};

const scheduleMSK = schedule.map(item => ({
    startTime: toMoscowTime(item.startTime),
    endTime: toMoscowTime(item.endTime),
}));

const lessonsMSK = lessons.map(lesson => ({
    ...lesson,
    startTime: toMoscowTime(lesson.startTime),
    endTime: toMoscowTime(lesson.endTime),
}));*/



function App() {
    return (
        <div className="app">
            <Calendar
                view="week"
                startDate={new Date(2025, 7, 25)}
                schedule={schedule}
                lessons={lessons}
                onSlotSelect={(slot) => console.log('Выбран слот', slot)}
            />
        </div>
    );
}

export default App;