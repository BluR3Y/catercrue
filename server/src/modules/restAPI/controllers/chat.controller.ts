import { RequestHandler } from "express";
import odm from "../../../models/mongoose";

export const getEventChat: RequestHandler = async (req, res, next) => {
    try {
        const { eventId } = req.params;

    } catch (err) {
        next(err);
    }
}

export const getGroupChat: RequestHandler = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        // Last Here: Implement Role-based Access
    } catch (err) {
        next(err);
    }
}

export const getChatRoom: RequestHandler = async (req, res, next) => {
    try {
        const { identifierType, roomId } = req.params;
        const user = req.user as any;

        const room = await odm.roomModel.findOne({
            variant: identifierType,
            _id: roomId
        });
        if (!room) {
            res.status(404).json({ message: "Room does not exist" });
            return;
        }

        if (!room.members.includes(user.id)) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        const roomData: any = {
            members: room.members,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
        }

        if (room.variant === 'TeamRoom') {
            roomData['eventId'] = (room as any).eventId;
        } else if (room.variant === 'Channel') {
            roomData['chatId'] = (room as any).chatId;
            roomData['name'] = (room as any).name
        }

        res.json(roomData);
    } catch (err) {
        next(err);
    }
}

export const getMessages: RequestHandler = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        const messages = await odm.messageModel.find({
            roomId
        });
        // Missing Logic
    } catch (err) {
        next(err);
    }
}