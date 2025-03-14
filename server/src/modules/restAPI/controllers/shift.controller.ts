import { Request, Response, NextFunction, RequestHandler } from "express";
import { odm } from "@/models";

export const createShift: RequestHandler = async (req, res, next) => {
    try {

    } catch (err) {
        next();
    }
}

export const getShifts: RequestHandler = async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}

export const rejectShift: RequestHandler = async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}
