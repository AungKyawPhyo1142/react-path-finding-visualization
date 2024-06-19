import { useEffect, useState } from "react";
import Node from "./Node";
import { dijkstra, getNodesInShortestPathOrder } from "./algorithms/dijkstra";

export interface Node {
  col: number;
  row: number;
  isStart: boolean;
  isFinish: boolean;
  distance: number;
  isVisited: boolean;
  isWall: boolean;
  previousNode: Node | null;
}

export interface Grid {
  nodes: Node[][];
}

// ** Constants **
const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }

  return grid;
};

const createNode = (col: number, row: number) => {
  return {
    col,
    row,
    isStart: row === 10 && col === 5,
    isFinish: row === 10 && col === 45,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (
  grid: Node[][],
  row: number,
  col: number
) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const PathFindingVisualizer = () => {
  const [grid, setGrid] = useState<Grid>({ nodes: [] });
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    setGrid({ nodes: getInitialGrid() });
  }, []);

  const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`)!.className =
          "node node-shortest-path";
      }, 50 * i);
    }
  };

  const animateDijkstra = (
    visitedNodesInOrder: Node[] | undefined,
    nodesInShortestPathOrder: Node[]
  ) => {
    if (!visitedNodesInOrder) return;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];

        document.getElementById(`node-${node.row}-${node.col}`)!.className =
          "node node-visited";
      }, 10 * i);
    }
  };

  const visualizeDijkstra = () => {
    const startNode = grid.nodes[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid.nodes[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = getNewGridWithWallToggled(grid.nodes, row, col);
    setGrid({ nodes: newGrid });
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid.nodes, row, col);
    setGrid({ nodes: newGrid });
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  return (
    <>
      <div className="grid-container">
        <div className="button-container">
          <button className="algo-button" onClick={() => visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
        </div>
        <div className="grid">
          {grid.nodes.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { isStart, isFinish, isWall, row, col } = node;
                  return (
                    <Node
                      isStart={isStart}
                      isFinish={isFinish}
                      key={nodeIdx}
                      isWall={isWall}
                      col={col}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                      onMouseUp={() => handleMouseUp()}
                      row={row}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PathFindingVisualizer;
