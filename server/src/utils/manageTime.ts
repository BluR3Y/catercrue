
export function parseMinutes(timeStr: string) {
    let [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

export function addMinutesToDate(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
}