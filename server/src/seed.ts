import Landmark from "./landmark.ts";
import database from "./Database.ts";

interface Neighbor {
    name: string;
    distance: number;
}

interface Landmark {
    name: string;
    top: number;
    left: number;
    width: number;
    height: number;
    neighbours: Neighbor[];
}

const spacingFactor = 0.4;  // Convert the distances into spacing on the 2D plane

// Function to adjust position of a landmark based on its neighbors
const adjustLandmarkPosition = (landmark: Landmark, landmarksMap: Map<string, Landmark>): void => {
    // Loop through the neighbors of the landmark
    landmark.neighbours.forEach(neighborInfo => {
        const neighbor = landmarksMap.get(neighborInfo.name);
        if (neighbor) {
            // Adjust the position of the neighbor based on the distance
            const distance = neighborInfo.distance * spacingFactor;
            
            // Basic rule: Shift the landmark to the right or downwards based on the distance
            neighbor.left = landmark.left + distance; 
            neighbor.top = landmark.top + distance;
        }
    });
};

database.once('open', async () => {
    try {
        await Landmark.deleteMany();  // Clear previous data

        const landmarks = [
            {
                name: "Unilag Gate",
                top: 5,   
                left: 6, 
                width: 5,    // Width of the block (percentage or fixed value)
                height: 5,   // Height of the block
                neighbours: [
                    { name: "Environmental science", distance: 35 },
                    { name: "Education", distance: 20 },
                    {name: "Wema Bank",  distance: 15 }
                ]
            },
            {
                name: "Jelili Hall",
                top: 3,
                left: 8,
                width: 10,
                height: 10,
                neighbours: [
                    { name: "Sport Center", distance: 3 },
                    { name: "Environmental science", distance: 20 },
                    { name: "Wema Bank",  distance: 40 }
                ]
            },
            {
                name: "Education",
                top: 6,
                left: 10,
                width: 10,
                height: 7,
                neighbours: [
                    { name: "Unilag Gate", distance: 35 },
                    { name: "Wema Bank", distance: 27 },
                    {name: "Kofoworola Hostel", distance: 40}
                ]
            },
            {
                name: "Environmental science",
                top: 10,
                left: 4,
                width: 10,
                height: 12,
                neighbours: [
                    { name: "St. Thomas", distance: 24 },
                    { name: "Unilag Gate", distance: 35 },
                    { name: "Jelili Hall", distance: 20 }
                ]
            },
            {
                name: "Wema Bank",
                top: 7,
                left: 5,
                width: 12,
                height: 15,
                neighbours: [
                    { name: "Unilag Gate", distance: 15 },
                    { name: "Education", distance: 27 },
                    { name: "Jelili Hall", distance: 27 }
                ]
            },
            {
                name: "St. Thomas",
                top: 10,
                left: 10,
                width: 6,
                height: 10,
                neighbours: [
                    { name: "Environment Science", distance: 24 },
                    { name: "Chapel of Christ", distance: 5.9 }
                ]
            },
            {
                name: "Chapel of Christ",
                top: 10,
                left: 4,
                width: 16,
                height: 8,
                neighbours: [
                    { name: "Central Mosque", distance: 11 },
                    { name: "Sport Center", distance: 70 }
                ]
            },
            {
                name: "Central Mosque",
                top: 10,
                left: 10,
                width: 18,
                height: 12,
                neighbours: [
                    { name: "Chapel of Christ", distance: 11 },
                    { name: "New Hall", distance: 29 }
                ]
            },
            {
                name: "Sport Center",
                top: 15,
                left: 12,
                width: 15,
                height: 15,
                neighbours: [
                    { name: "Chapel of Christ", distance: 70 },
                    { name: "Jelili Hall", distance: 3 },
                    { name: "Amphiteather", distance: 30 }
                ]
            },
            {
                name: "Amphiteather",
                top: 15,
                left: 10,
                width: 15,
                height: 10,
                neighbours: [
                    {name: "Sport Center", distance: 30},
                    {name: "Nord", distance: 13}
                ]
            },
            {
                name: "Nord",
                top: 15,
                left: 20,
                width: 15,
                height: 15,
                neighbours: [
                    {name: "Amphiteather", distance: 13},
                    {name: "Access Bank", distance: 19}
                ]
            },
            {
                name: "Access Bank",
                top: 10,
                left: 18,
                width: 12,
                height: 15,
                neighbours: [
                    {name: "Nord", distance: 19},
                    {name: "Nithub",  distance: 35},
                    {name: "New Hall",  distance: 4.2},
                    {name: "CITS", distance: 40}
                ]
            },
            {
                name: "New Hall",
                top: 12,
                left: 12,
                width: 20,
                height: 15,
                neighbours: [
                    {name: "Central Mosque",  distance: 29},
                    {name: "Access Bank", distance: 4.2},
                    {name: "Fire Station", distance: 45}

                ]
            },
            {
                name: "Nithub",
                top:  5,
                left:  22,
                width: 20,
                height:  15,
                neighbours:[
                    {name: "Access Bank", distance: 35},
                    {name: "Faculty of Social Science", distance: 6.5 }
                ]
            },
            {
                name: "Faculty of Social Science",
                top: 0,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name:  "Nithub", distance: 6.5 },
                    {name: "DLI ", distance: 50},
                    {name: "International school of Lagos", distance: 60 }
                ]
            },
            {
                name: "Kofo Hall",
                top: 5,
                left: 20,
                width: 20,
                height: 15,
                neighbours: [
                    {name: "Education", distance: 40},
                    {name: "Biobaku Hall", distance: 26}
                ]
            },
            {
                name: "Biobaku Hall",
                top: 8,
                left: 15,
                width: 20,
                height:  15,
                neighbours: [
                    {name: "Kofo Hall",  distance: 26 },
                    {name: "International school of Lagos", distance:90}
                ]
            },
            {
                name: "International school of Lagos",
                top: 7,
                left: 22,
                width: 20,
                height:  15,
                neighbours: [
                    {name: "Faculty of Social Science", distance: 60 },
                    {name: "Biobaku Hall", distance: 90 },
                    {name: "DLI", distance: 25 },
                    {name: "Unilag Second Gate", distance: 60}
                ]
            },
            {
                name: "DLI",
                top: 10,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Unilag Medical Center", distance: 85 },
                    {name: "International school of Lagos",  distance: 20 },
                    {name: "Faculty of Social Science",  distance: 50 }
                ]
            },
            {
                name: "Unilag Second Gate",
                top: 12,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "International school of Lagos", distance: 60 },
                ]
            },
            {
                name: "CITS",
                top: 16,
                left: 18,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Access Bank", distance: 40 },
                    {name: "Fire Station", distance: 14 },
                ]
            },
            {
                name: "Fire Station",
                top: 10,
                left: 15,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "CITS", distance: 14 },
                    {name: "Faculty of Arts", distance: 23}
                ]
            },
            {
                name: "Faculty of Arts",
                top: 13,
                left: 15,
                width: 15,
                height: 10,
                neighbours: [
                    {name: "Fire Station", distance: 23},
                    {name: "Sofoluwe Park", distance:4.9 },
                    {name: "Faculty of Law", distance:23 },
                    {name: "Unilag Senate Building", distance: 15 },
                ]
            },
            {
                name: "Sofoluwe Park",
                top: 20,
                left: 10,
                width: 10,
                height: 15,
                neighbours: [
                    {name: "Faculty of  Arts", distance: 4.9 },
                    {name: " Faculty of Engineering ", distance: 14 },
                    {name: "Unilag Senate Building", distance: 10 },

                ]
            },
            {
                name: "Faculty of Law",
                top: 18,
                left: 15,
                width: 20,
                height: 20,
                neighbours: [
                    {name: "Faculty of Arts", distance: 23 },
                    {name: "Unilag Senate Building", distance: 7.5 },
                    {name: "Unilag Library", distance: 5.1}
                ]
            },
            {
                name: "Unilag Library",
                top: 20,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Faculty  of Law", distance: 5.1 },
                    {name:  "Unilag Senate Building", distance: 9.8 },
                    {name: "Lagoon Front", distance: 5}
                ]
            },
            {
                name: "Lagoon Front",
                top: 18,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Unilag Library", distance: 5 },
                    {name:  "Faculty of Engineering", distance: 35 },
                ]
            },
            {
                name:  "Faculty of Engineering",
                top: 20,
                left: 15,
                width: 20,
                height: 20,
                neighbours: [
                    {name: "Lagoon Front", distance: 35},
                    {name: "Unilag Senate Building", distance: 11},
                    {name: "Sofoluwe Park", distance: 14},
                    {name: "Faculty of Science", distance: 45}
                ]
            },
            {
                name: "Unilag Senate Building",
                top: 15,
                left: 10,
                width:20,
                height: 15,
                neighbours: [
                    {name: "Sofoluwe  Park", distance: 10 },
                    {name: "Faculty of Engineering", distance: 11 },
                    {name: "Faculty of Arts", distance: 15 },
                    {name: "Faculty of Law", distance: 7.5 },
                    {name: "Unilag Library", distance: 9.8 },
                ]
            },
            {
                name: "Faculty of Science",
                top: 10,
                left: 10,
                width:20,
                height: 15,
                neighbours: [
                    {name: "Faculty of Engineering", distance: 45},
                    {name: "King Jaja Hall", distance: 40},
                    {name: "Dept. of Chemical Engineering", distance: 16}
                ]
            },
            {
                name: "King Jaja Hall",
                top: 12,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Faculty of Science", distance: 40 },
                    {name: "Dept. of Chemical Engineering", distance: 28 },
                    {name: "Staff school hall", distance: 23 }
                ]
            },
            {
                name: "Staff school hall",
                top: 15,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "King Jaja Hall", distance: 23 },
                    {name: "Women Society School", distance: 15 }
                ] 
            },
            {
                name: "Dept. of Chemical Engineering",
                top: 10,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "King Jaja Hall", distance: 28 },
                    {name: "Women Society School", distance: 10 },
                    {name: "Faculty of Science", distance: 16 }
                ] 
            },
            {
                name: "Women Society School",
                top: 8,
                left: 12,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Staff school hall", distance: 15 },
                    {name: "Dept. of Chemical Engineering", distance: 10 },
                    {name: "Unilag Medical Center", distance: 5}
                ]
            },
            {
                name: "Unilag Medical Center",
                top: 15,
                left: 15,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Women Society School", distance: 5 },
                    {name: "DLI", distance: 85 }
                ]    
            },
            {
                name: "DLI",
                top: 0,
                left: 10,
                width: 20,
                height: 10,
                neighbours: [
                    {name: "Unilag Medical Center", distance: 85 },
                    {name: "International school of Lagos",  distance: 20 },
                    {name: "Faculty of Social Science",  distance: 50 }
                ]
            }
        ];

        // Create a map for quick access by name
        const landmarksMap = new Map();
        landmarks.forEach(landmark => landmarksMap.set(landmark.name, landmark));

        // Adjust the positions for each landmark based on its neighbors
        landmarks.forEach(landmark => adjustLandmarkPosition(landmark, landmarksMap));

        // Insert updated landmarks with adjusted positions into the database
        await Landmark.insertMany(Array.from(landmarksMap.values()));  
        console.log("Landmark data with adjusted positions inserted successfully");

    } catch (err) {
        console.error("Error inserting landmark data:", err);
    } finally {
        process.exit();  // Ensure the process exits only after all operations
    }
});
