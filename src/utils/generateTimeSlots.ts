// Генерация временных слотов (только время, без даты) в UTC
export const generateTimeSlots = (startHour: number, endHour: number): Date[] => {
    const total = (endHour - startHour) * 2;
    return Array.from({length: total}, (_, i) => {
        const hour = startHour + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        return new Date(Date.UTC(1970, 0, 1, hour, minute));
    });
};