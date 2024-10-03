import mongoose from "mongoose";
const landmarkSchema = new mongoose.Schema({
    name: String,
    neightbours: [{ name: String, distance: Number }]
});
const Landmark = mongoose.model("Landmark", landmarkSchema);
export default Landmark;
