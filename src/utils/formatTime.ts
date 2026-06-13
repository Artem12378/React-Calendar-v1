// Форматирование времени (локальное)
export const formatTime = (date: Date): string => {
    const startHours = date.getUTCHours().toString().padStart(2, '0');
    const startMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    const endDate = new Date(date.getTime() + 30 * 60000);
    const endHours = endDate.getUTCHours().toString().padStart(2, '0');
    const endMinutes = endDate.getUTCMinutes().toString().padStart(2, '0');
    return `${startHours}:${startMinutes} ${endHours}:${endMinutes}`;
};