import mongoose, { Document, Schema } from "mongoose";

// Extend the UnilagLandmark interface to include top and left coordinates
export interface UnilagLandmark extends Document {
    name: string;
    top: number;  // Add top coordinate
    left: number; // Add left coordinate
    width: number;
    height: number;
    neighbours: {
        name: string;
        distance: number;
    }[];
}

// Update the schema to include top and left coordinates
const landmarkSchema = new mongoose.Schema<UnilagLandmark>({
    name: { type: String, required: true },
    top: { type: Number, required: true },    // Add top coordinate to schema
    left: { type: Number, required: true },   // Add left coordinate to schema
    width: { type: Number, required: true },
    height: {type: Number, required: true},
    neighbours: [
        { name: { type: String, required: true }, distance: { type: Number, required: true } }
    ]
});

const Landmark = mongoose.model<UnilagLandmark>("Landmark", landmarkSchema);

export default Landmark;
