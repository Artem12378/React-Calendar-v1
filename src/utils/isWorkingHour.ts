// Проверка, входит ли временной слот в рабочие интервалы (UTC сравнение)
import type {ScheduleInterval} from "../types/calendar";

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