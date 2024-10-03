var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Landmark from "./landmark";
import database from "./Database";
database.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
    yield Landmark.deleteMany();
    const landmarks = [
        {
            name: "Unilag Gate",
            neighbours: [
                { name: "environmental science", distance: 28 },
                { name: "Education", distance: 30 },
            ]
        },
        {
            name: "Jelili Hall",
            neighbours: [
                { name: "class A", distance: 24 },
                { name: "Class B", distance: 20 },
            ]
        }
    ];
    yield Landmark.insertMany(landmarks);
}));
console.log("Example data inserted");
process.exit();
