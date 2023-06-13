import { useContext, useEffect, useState } from 'react';
import Blockly from 'blockly';
import './App.css';
import Task from './Task'
import AnswerZone from './AnswerZone'
import StatusZone from './StatusZone'
import { TaskElementType, TaskContext } from './TaskContext';
import TaskStructure from './TaskStructure'
import EndBtn from './EndBtn';
import HintBtn from './HintBtn';
import { axiosInstance } from './axios/axiosInstance';




function TaskZone() {
  const [taskCondition, setTaskCondition] = useContext(TaskContext);
  const [isStarted, setIsStarted] = useState(false)

  async function getFirstTask() {
    const response = await axiosInstance.get('/getTask/0')

    console.log(response.headers)
    axiosInstance.defaults.headers.my_session = response.headers['my_session']
    setTaskCondition({
      condition: response.data['condition'],
      taskStructure: response.data['taskStructure'],
      operands: response.data['availableOperands'].map((operand) => {
        return [operand.first, operand.second]
      })
    })

    console.log(response.data['availableOperands'])
  }

  useEffect(() => {
    if (!isStarted) {
      getFirstTask()

      setIsStarted(true)
    }
  }, [])

  return (
    <div className='px-8 py-6 min-h-screen bg-gray-400 flex flex-col justify-center'>
      <div className='px-8 py-6 h-auto border border-black flex flex-col gap-10 justify-center rounded-md bg-white items-start'>
        <Task></Task>
        <TaskStructure elements={taskCondition.taskStructure} />
        <AnswerZone />
        <StatusZone />
        {/* <OptionsForContinuing></OptionsForContinuing> */}
        <div className="w-full flex justify-between"><HintBtn /><EndBtn/></div>
      </div>
    </div>
  );
}

export default TaskZone;
