import { useContext, useEffect, useState } from "react";
import Blockly, { WorkspaceSvg } from 'blockly'
import { jsonGenerator } from './generators/JsonGenerator';
import { axiosInstance } from './axios/axiosInstance';
import { TaskContext, StatusContext, StatusEnum } from './TaskContext';

function HintBtn() {
  const [status, setStatus] = useContext(StatusContext)
  const [taskCondition, setTaskCondition] = useContext(TaskContext)
  let hintBtnText = 'Запросить подсказку'

  async function getHint() {
    let workspace = Blockly.getMainWorkspace() as WorkspaceSvg
    let code = jsonGenerator.workspaceToCode(workspace)

    if (code) {
      let response = await axiosInstance.post('/getHint/', code, {
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
        setStatus({
          status: StatusEnum.hint,
          text: response.data['message']
        })
      }
    } else {
      let response = await axiosInstance.post('/getHint/', JSON.stringify({ 
        type: 'start', 
        operand: null,
        secondOperand: null,
        operator: null,
        next: null
      }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
        }
      })

      if (response.data['status']) {
        setStatus({
          status: StatusEnum.hint,
          text: response.data['message']
        })
      }
    }
  }

  async function btnClick() {
    if (status.status == StatusEnum.success) {
      //await getNextTask()
    } else {
      await getHint()
    }
  }

  return (
    <div className="px-3.5 py-2.5 font-sans text-base border border-neutral-700 rounded bg-white hover:bg-neutral-400 hover:shadow-md hover:shadow-slate-700 cursor-pointer self-end transition-all" onClick={() => btnClick()}>
      {hintBtnText}
    </div>
  );
}

export default HintBtn;
