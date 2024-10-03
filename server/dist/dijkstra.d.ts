interface Neighbours {
    [name: string]: number;
}
export default function dijkstra(graph: Record<string, Neighbours>, start: string, end: string): string[];
export {};
