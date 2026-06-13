import type {View} from "../types/calendar.ts";

export const getDaysForView = (view: View, startDate: Date): Date[] => {
    const days: Date[] = [];
    const count = view === 'day' ? 1 : view === '3days' ? 3 : 7;


    const start = new Date(startDate);
    for (let i = 0; i < count; i++) {
        days.push(new Date(start));
        start.setDate(start.getDate() + 1);
    }
    return days;
};