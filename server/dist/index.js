import express from "express";
import bodyParser from "body-parser";
import database from "./Database";
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
try {
    database.once("open", () => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
}
catch (error) {
    console.error("Error starting the server:", error);
}
