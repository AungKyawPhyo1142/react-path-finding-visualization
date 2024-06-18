import { Grid, Node } from "../PathFindingVisualizer";

export const dijkstra = (grid: Grid, startNode: Node, finishNode: Node) => {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift()!;
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
};

function getAllNodes(grid: Grid) {
  const nodes = [];
  for (const row of grid.nodes) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByDistance(unvisitedNodes: Node[]) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node: Node, grid: Grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node: Node, grid: Grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid.nodes[row - 1][col]);
  if (row < grid.nodes.length - 1) neighbors.push(grid.nodes[row + 1][col]);
  if (col > 0) neighbors.push(grid.nodes[row][col - 1]);
  if (col < grid.nodes[0].length - 1) neighbors.push(grid.nodes[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function getNodesInShortestPathOrder(finishNode: Node) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode!;
  }
  return nodesInShortestPathOrder;
}
