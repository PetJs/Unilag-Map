import express from "express";
import cors from 'cors'; 
import bodyParser from  "body-parser";
import database from "./Database.ts";
import Landmark, {UnilagLandmark} from "./landmark.ts";
import dijkstra from "./dijkstra.ts";


const app = express();
const  PORT = 3000;

app.use(bodyParser.json())


app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed methods
}));

interface Neighbours{
    [name: string]: number
}

app.get("/Landmark",  async(req, res) => {
    try {
        const landmarks = await Landmark.find();
        res.json(landmarks)
    } catch(error){
        console.log('Error Fetching landmarks', error)
        res.status(500).json({message: "Failed to fetch the landmarks"})
    }
})

app.post("/calculate-path", async(req, res) => {
    const {start, end} = req.body;
    const landmarks: UnilagLandmark[] = await Landmark.find();
    const graph: Record<string, Neighbours> = {}

    landmarks.forEach((landmark) => {
        graph[landmark.name] = {};
        landmark.neighbours.forEach((neighbour) => {
            graph[landmark.name][neighbour.name] = neighbour.distance;
        })
    });

    const shortestPath = dijkstra(graph, start, end);
    res.json({shortestPath});

})



try {
    database.once("open", () => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
} catch (error) {
    console.error("Error starting the server:", error);
}




