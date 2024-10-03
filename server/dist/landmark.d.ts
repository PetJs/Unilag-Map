import mongoose, { Document } from "mongoose";
export interface UnilagLandmark extends Document {
    name: string;
    top: number;
    left: number;
    width: number;
    height: number;
    neighbours: {
        name: string;
        distance: number;
    }[];
}
declare const Landmark: mongoose.Model<UnilagLandmark, {}, {}, {}, mongoose.Document<unknown, {}, UnilagLandmark> & UnilagLandmark & Required<{
    _id: unknown;
}>, any>;
export default Landmark;
