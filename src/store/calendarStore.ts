import { create } from 'zustand'
import type {Lesson, ScheduleInterval, View} from "../types/calendar.ts";
import {mockLessons, mockSchedule} from "./mockData.ts";


type CalendarState = {
    view: View;
    startDate: Date;
    schedule: ScheduleInterval[];
    lessons: Lesson[];

    //actions-props
    setView: (view: View) => void;
    setStartDate: (date: Date) => void;
    setSchedule: (schedule: ScheduleInterval[]) => void;
    setLessons: (lessons: Lesson[]) => void;
    goPrev: () => void;
    goNext: () => void;
    addSignUp: (newSign: Lesson) => void;
}


const getDelta = (view: View): number => {
    if (view === 'day') return 1;
    if (view === '3days') return 3;
    return 7;
};

export const useCalendarStore = create<CalendarState>((set, get) => ({
    view: 'week',
    startDate: new Date(2025, 7, 25),
    schedule: mockSchedule,
    lessons: mockLessons,

    setView: (view) => set({ view }),
    setStartDate: (startDate) => set({ startDate }),
    setSchedule: (schedule) => set({ schedule }),
    setLessons: (lessons) => set({ lessons }),

    goPrev: () => {
        const { view, startDate } = get();
        const delta = getDelta(view);
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() - delta);
        set({ startDate: newDate });
    },

    goNext: () => {
        const { view, startDate } = get();
        const delta = getDelta(view);
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + delta);
        set({ startDate: newDate });
    },
    addSignUp:(newSign:Lesson) =>
        set((state) => ({
            lessons: [...state.lessons, newSign],
        }))
}));