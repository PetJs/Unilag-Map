import Landmark from './landmark.ts';  // Make sure the path is correct
import database from './Database.ts';  // Ensure the connection is established

async function fetchLandmarks() {
  try {
    // Find all landmarks
    const landmarks = await Landmark.find({});
    console.log("Landmarks found:", landmarks);
  } catch (error) {
    console.error("Error fetching landmarks:", error);
  } finally {
    database.close();  // Close the connection after query
  }
}

fetchLandmarks();
