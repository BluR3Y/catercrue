import { Schema, model, Document, Types } from "mongoose";

import { IWorker } from "../worker.schema";

import {achievementSchema, IAchievement} from "./achievements.schema";
import {educationSchema, IEducation} from "./education.schema";
import {experienceSchema, IExperience} from "./experience.schema";

export interface IContractor extends IWorker {
    bio?: string;
    experience?: IExperience[];
    achievements?: IAchievement[];
    education?: IEducation[];
    resumeUrl?: string;
    skills?: string[];
    // interests?: Types.ObjectId[];
}

export const contractorSchema = new Schema<IContractor>(
    {
        userId: {
            type: Schema.Types.UUID,
            required: true
        },
        bio: {
            type: Schema.Types.String,
        },
        experience: {
            type: [experienceSchema]
        },
        achievements: {
            type: [achievementSchema]
        },
        education: {
            type: [educationSchema]
        },
        skills: [{
            type: Schema.Types.String
        }],
        resumeUrl: {
            type: Schema.Types.String
        },
        variant: 'Contractor'
    },
    {
        timestamps: true,
        collection: 'contractors'
    }
);