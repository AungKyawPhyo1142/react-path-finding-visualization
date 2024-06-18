import { useEffect, useState } from "react";
import Node from "./Node";

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

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col));
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

const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

const PathFindingVisualizer = () => {
  const [grid, setGrid] = useState<Grid>({ nodes: [] });
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    setGrid({ nodes: getInitialGrid() });
  }, []);

  const visualizeDijkstra = () => {
    const startNode = grid.nodes[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid.nodes[FINISH_NODE_ROW][FINISH_NODE_COL];
    console.log(startNode, finishNode);
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
      <button onClick={() => visualizeDijkstra()}>
        Visualize Dijkstra's Algorithm
      </button>
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
    </>
  );
};

export default PathFindingVisualizer;
