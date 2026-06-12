
// Получить дни для отображения (1, 3 или 7 дней начиная с startDate)
import type {Lesson, ScheduleInterval, View} from "../types/calendar.ts";

export const getDaysForView = (view: View, startDate: Date): Date[] => {
    const days: Date[] = [];
    const count = view === 'day' ? 1 : view === '3days' ? 3 : 7;


    const start = new Date(startDate);
    for (let i = 0; i < count; i++) {
        days.push(new Date(start));
        start.setDate(start.getDate() + 1);
    }
    console.log(days)
    return days;
};



// Генерация временных слотов (только время, без даты) в UTC
export const generateTimeSlots = (startHour:number, endHour:number): Date[] => {
    const total = (endHour - startHour) * 2;
    return Array.from({ length: total  }, (_, i) => {
        const hour = startHour + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        return new Date(Date.UTC(1970, 0, 1, hour, minute));
    });
};

// Форматирование времени (локальное)
export const formatTime = (date: Date): string => {
    //return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Проверка, входит ли временной слот в рабочие интервалы (UTC сравнение)
export const isWorkingHour = (slotStart: Date, schedule: ScheduleInterval[]): boolean => {
    const slotUTC = Date.UTC(
        slotStart.getUTCFullYear(), slotStart.getUTCMonth(), slotStart.getUTCDate(),
        slotStart.getUTCHours(), slotStart.getUTCMinutes()
    );
    return schedule.some(interval => {
        const start = new Date(interval.startTime);
        const end = new Date(interval.endTime);
        const startUTC = Date.UTC(
            start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(),
            start.getUTCHours(), start.getUTCMinutes()
        );
        const endUTC = Date.UTC(
            end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(),
            end.getUTCHours(), end.getUTCMinutes()
        );
        return slotUTC >= startUTC && slotUTC < endUTC;
    });
};

// Получение урока, перекрывающего данный слот
export const getLessonForSlot = (slotStart: Date, slotEnd: Date, lessons: Lesson[]): Lesson | null => {
    const slotStartUTC = Date.UTC(
        slotStart.getUTCFullYear(), slotStart.getUTCMonth(), slotStart.getUTCDate(),
        slotStart.getUTCHours(), slotStart.getUTCMinutes()
    );
    const slotEndUTC = Date.UTC(
        slotEnd.getUTCFullYear(), slotEnd.getUTCMonth(), slotEnd.getUTCDate(),
        slotEnd.getUTCHours(), slotEnd.getUTCMinutes()
    );
    return lessons.find(lesson => {
        const lessonStart = new Date(lesson.startTime);
        const lessonEnd = new Date(lesson.endTime);
        const lessonStartUTC = Date.UTC(
            lessonStart.getUTCFullYear(), lessonStart.getUTCMonth(), lessonStart.getUTCDate(),
            lessonStart.getUTCHours(), lessonStart.getUTCMinutes()
        );
        const lessonEndUTC = Date.UTC(
            lessonEnd.getUTCFullYear(), lessonEnd.getUTCMonth(), lessonEnd.getUTCDate(),
            lessonEnd.getUTCHours(), lessonEnd.getUTCMinutes()
        );
        return slotStartUTC >= lessonStartUTC && slotEndUTC <= lessonEndUTC;
    }) || null;
};