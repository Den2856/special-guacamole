import { Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;
  userName: string;
  avatarUrl: string;
  rating: number;
  text: string;
  highlighted?: boolean;
}