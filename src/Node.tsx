import clsx from "clsx";
import React from "react";

interface NodeProps {
  isStart: boolean;
  isFinish: boolean;
  col: number;
  row: number;
  isWall: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Node: React.FC<NodeProps> = ({
  isStart,
  isFinish,
  col,
  row,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  return (
    <div
      className={clsx(
        "node",
        isStart && "node-start",
        isFinish && "node-finish",
        isWall && "node-wall"
      )}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    />
  );
};

export default Node;
