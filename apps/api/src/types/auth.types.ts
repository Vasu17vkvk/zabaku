import { IUser } from "./user.types";
import { Document, Types } from "mongoose";

export type AuthenticatedUser = Document<unknown, {}, IUser> &
    IUser & {
        _id: Types.ObjectId;
    };