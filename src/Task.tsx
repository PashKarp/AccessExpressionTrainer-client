import React, { useContext } from "react";
import { TaskContext } from "./TaskContext";

function Task() {
    const [task, setTask] = useContext(TaskContext)
    return (
        <div className="w-full">
            <div className="font-sans text-base font-medium">
                Задание
            </div>
            <div className="font-sans text-base border border-gray-400 rounded-xl px-5 py-4">
                {task.condition}
            </div>
        </div>
    );
  }
  
  export default Task;
  