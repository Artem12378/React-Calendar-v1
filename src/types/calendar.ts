export type View = 'day' | '3days' | 'week';

export type ScheduleInterval = {
    startTime: string;   // ISO строка
    endTime: string;
};

export type Lesson = {
    id: number;
    duration: number;    // в минутах
    startTime: string;
    endTime: string;
    student: string;
};

export type TimeSlot = {
    start: Date;
    end: Date;
};

export type CalendarProps = {
    view?: View;
    startDate?: Date;
    schedule?: ScheduleInterval[];
    lessons?: Lesson[];
    onSlotSelect?: (slot: TimeSlot) => void;
};