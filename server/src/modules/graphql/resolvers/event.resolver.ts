import { odm } from "@/models";
import { authenticate } from "@/auth";
import { Request, Response, NextFunction } from "express";

export const eventResolver = {
    Query: {
        getEvent: async (parent: any, args: any, { user }: { user: any }) => {
            console.log(user);
        }
    }
}