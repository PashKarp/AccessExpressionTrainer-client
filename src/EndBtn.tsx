import { useContext, useEffect, useState } from "react";
import Blockly, { WorkspaceSvg } from 'blockly'
import { jsonGenerator } from './generators/JsonGenerator';
import { axiosInstance } from './axios/axiosInstance';
import { TaskContext, StatusContext, StatusEnum } from './TaskContext';

function EndBtn() {
  const [status, setStatus] = useContext(StatusContext)
  const [taskCondition, setTaskCondition] = useContext(TaskContext)
  let checkBtnText = 'Закончить ввод выражения'
  if (status.status == StatusEnum.success) {
    checkBtnText = 'Продолжить'
  }

  async function getNextTask() {
    const response = await axiosInstance.get('/getNextTask/')

    console.log(response.headers)
    console.log('Get next task')
    axiosInstance.defaults.headers.my_session = response.headers['my_session']
    setTaskCondition({
      condition: response.data['condition'],
      taskStructure: response.data['taskStructure'],
      operands: response.data['availableOperands'].map((operand) => {
        return [operand.first, operand.second]
      })
    })

    console.log(response.data['availableOperands'])
    Blockly.getMainWorkspace().clear()
    setStatus({
      status: StatusEnum.none,
      text: ''
    })
  }

  async function checkFullExpression() {
    let workspace = Blockly.getMainWorkspace() as WorkspaceSvg
    let code = jsonGenerator.workspaceToCode(workspace)

    if (code) {
      let response = await axiosInstance.post('/checkFullAnswer/', code, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
        }
      })

      console.log(response.data['status'])
      if (!response.data['status']) {
        setStatus({
          status: StatusEnum.error,
          text: response.data['message']
        })

        workspace.getAllBlocks(true).forEach((block) => {
          if (block.isEditable()) {
            block.getConnections_(true).forEach((connection) => {
              connection.disconnectInternal(true)
            })
            block.dispose(true, true)
          }
        })

        workspace.render()
      } else {
        workspace.getTopBlocks(true).forEach((block) => {
          let childBlock = block.getInputTargetBlock('next')
          while (childBlock.getInputTargetBlock('next')) {
            childBlock = childBlock.getInputTargetBlock('next')
          }
          let endBlock = new Blockly.BlockSvg(workspace, 'end_block')
          endBlock.setEditable(false)
          endBlock.setDeletable(false)
          childBlock.getInput('next').connection.connect(endBlock.outputConnection)
          endBlock.setMovable(false)
          endBlock.render()

          let startBlock = new Blockly.BlockSvg(workspace, 'start_block')
          startBlock.setEditable(false)
          startBlock.setDeletable(false)
          startBlock.setMovable(false)
          startBlock.getInput('next').connection.connect(block.outputConnection)
          startBlock.render()
        })
        setStatus({
          status: StatusEnum.success,
          text: 'Вы закончили выполнение задания. Если желаете, можете продолжить выполнение заданий, нажав на кнопку продолжить'
        })
        workspace.render()

        // setTimeout(() => {
        //   console.log(workspace.getAllBlocks(true))
        //   workspace.getAllBlocks(true).forEach((block) => {
        //     block.render()
        //   })
        //   workspace.render()
        // }, 4000)
      }
    } else {
      setStatus({
        status: StatusEnum.hint,
        text: 'Выберите стартовый элемент выражения'
      }
      )
    }
  }

  async function btnClick() {
    if (status.status == StatusEnum.success) {
      await getNextTask()
    } else {
      await checkFullExpression()
    }
  }

  return (
    <div className="px-3.5 py-2.5 font-sans text-base border border-neutral-700 rounded bg-white hover:bg-neutral-400 hover:shadow-md hover:shadow-slate-700 cursor-pointer self-end transition-all" onClick={() => btnClick()}>
      {checkBtnText}
    </div>
  );
}

export default EndBtn;
