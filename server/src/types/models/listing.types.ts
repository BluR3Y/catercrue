import { Document, Types } from "mongoose";

export interface IListing extends Document {
    coordinatorId: Types.ObjectId;
    isPrivate?: boolean;
    position: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    variant?: 'Contract' | 'Job';
}

interface NegotiableWage {
    type: 'negotiable';
}

type ContractRates = 'Hour' | 'Day' | 'Week';

interface ContractFixedWage {
    type: 'fixed';
    rate: ContractRates;
    value: number;
}

interface ContractRangeWage {
    type: 'range';
    rate: ContractRates;
    min: number;
    max: number;
}

export interface IContractListing extends IListing {
    events: Types.ObjectId[];
    wage: ContractFixedWage | ContractRangeWage | NegotiableWage;
}

type JobRates = ContractRates | 'Month' | 'Year';

interface JobFixedWage {
    type: 'fixed';
    rate: JobRates;
    value: number;
}

interface JobRangeWage {
    type: 'range';
    rate: JobRates;
    min: number;
    max: number;
}

type JobType = 'Seasonal' | 'Full-Time' | 'Part-Time' | 'Temporary';

export interface IJobListing extends IListing {
    venueId?: Types.ObjectId;
    location?: string;
    jobTypes: ReadonlyArray<JobType>;
    wage: JobFixedWage | JobRangeWage | NegotiableWage;
}