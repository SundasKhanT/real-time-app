import React, { useEffect } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import constants from "../../constants";
import { useRectangles } from "../store/useRectangle";
import type { Rectangle } from "../types/rectangles";

let socket: Socket;

const CanvasStage: React.FC = () => {
  const rectangles = useRectangles((state) => state.rectangles);
  const addRectangle = useRectangles((state) => state.addRectangle);
  const updateRectanglePosition = useRectangles(
    (state) => state.updateRectanglePosition
  );
  const setRectangles = useRectangles((state) => state.setRectangles);

  useEffect(() => {
    (socket = io(constants.BACKEND_URL)),
      socket.on("connect", () => {
        socket.on("rectangle:init", (rects: Rectangle[]) => {
          setRectangles(rects);
        });

        console.log("Connected to server:", socket.id);
      });

    socket.on("rectangle:add", (rect: Rectangle) => {
      addRectangle(rect);
    });

    socket.on(
      "rectangle:move",
      (data: { id: string; x: number; y: number }) => {
        updateRectanglePosition(data.id, data.x, data.y);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAddRectangle = () => {
    const newRect: Rectangle = {
      id: uuidv4(),
      x: 20,
      y: 20,
      width: 100,
      height: 100,
    };

    addRectangle(newRect);
    socket.emit("rectangle:add", newRect);
  };

  const handleDragMove = (id: string, e: any) => {
    const { x, y } = e.target.position();
    updateRectanglePosition(id, x, y);
    socket.emit("rectangle:move", { id, x, y });
  };

  return (
    <div className="p-4">
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleAddRectangle}
      >
        Add Rectangle
      </button>
      <Stage width={window.innerWidth} height={window.innerHeight - 100}>
        <Layer>
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill="lightblue"
              draggable
              onDragMove={(e) => handleDragMove(rect.id, e)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasStage;
