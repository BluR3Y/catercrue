
export enum WeekDay {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
}

export interface ILocation {
    type: 'Point';
    coordinates: [number, number];
};

// Define time slot structure
export interface ITimeSlot {
    start: string;
    end: string;
}