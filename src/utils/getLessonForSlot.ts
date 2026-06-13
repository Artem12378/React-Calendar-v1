// Получить дни для отображения (1, 3 или 7 дней начиная с startDate)
import type {Lesson} from "../types/calendar.ts";


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