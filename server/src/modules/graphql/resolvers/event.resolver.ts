import { odm } from "@/models";
import { authenticate } from "@/modules/restAPI/middlewares/auth";
import { Request, Response, NextFunction } from "express";

export const eventResolver = {
    Query: {
        event: async ()
    }
}