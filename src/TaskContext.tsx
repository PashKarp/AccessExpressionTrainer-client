import React, {createContext, useState} from "react";

export enum TaskElementType {
  struct = 'struct',
  variable = 'variable'
}
export type TaskElement = {
  type: TaskElementType,
  text: string,
  elements: Array<TaskElement>
}

export type TaskCondition = {
  condition : string,
  taskStructure : Array<TaskElement>,
  operands: Array<Array<string>>
}

export enum StatusEnum {
  error,
  hint,
  success,
  none
}

export type TaskStatus = {
  status : StatusEnum,
  text : string
}

export const TaskContext = createContext([])
export const StatusContext = createContext([])

export function TaskElContext({ children }) {
    const [taskCondition, setTaskCondition] = useState<TaskCondition>({
      condition: '',
      taskStructure: [],
      operands: []
    })

    const [status, setStatus] = useState({
      status : StatusEnum.none,
      text : ''
    })

    return <TaskContext.Provider value={[taskCondition, setTaskCondition]}>
      <StatusContext.Provider value={[status, setStatus]}>
        {children}
      </StatusContext.Provider>
    </TaskContext.Provider>
  }
  