interface Neighbours {
    [name: string]: number;
  }
  
  export default function dijkstra(graph: Record<string, Neighbours>, start: string, end: string): string[] {
    const distances: Record<string, number> = {}; // Initialize distances
    const previous: Record<string, string | null> = {}; // Track previous vertices
    const queue: string[] = []; // Queue of vertices to process
  
    // Initialize distances and previous maps
    for (const vertex in graph) {
      if (vertex === start) {
        distances[vertex] = 0; // Starting point has a distance of 0
        queue.push(vertex); // Add to queue
      } else {
        distances[vertex] = Infinity; // All other vertices have an infinite distance initially
        queue.push(vertex);
      }
      previous[vertex] = null; // No previous vertex yet
    }
  
    // Main loop for processing the queue
    while (queue.length > 0) {
      // Sort queue based on the shortest known distance, then shift the first vertex
      const shortestVertex = queue.sort((a, b) => distances[a] - distances[b]).shift()!;
      
      // If the shortest distance is Infinity, the remaining vertices are unreachable
      if (distances[shortestVertex] === Infinity) break;
  
      // Process each neighbour of the current vertex
      for (const neighbour in graph[shortestVertex]) {
        const distance = graph[shortestVertex][neighbour]; // Distance to neighbour
        const alt = distances[shortestVertex] + distance; // Alternate distance
  
        // If a shorter path is found, update the distance and previous vertex
        if (alt < distances[neighbour]) {
          distances[neighbour] = alt;
          previous[neighbour] = shortestVertex;
        }
      }
    }
  
    // Reconstruct the shortest path from start to end
    const path: string[] = [];
    let current: string | null = end;
    
    // If there's no path to the end vertex, return an empty array
    if (distances[end] === Infinity) {
      return [];
    }
  
    // Construct the path by following the previous pointers
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
  
    return path; // Return the reconstructed path
  }
  