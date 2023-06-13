import { useContext, useEffect, useState } from "react";
import { BlocklyWorkspace, WorkspaceSvg } from 'react-blockly';
import Blockly from 'blockly'
import { jsonGenerator } from './generators/JsonGenerator'
import './Blockly/BlocklyComponent.css';
import './blocks/customblocks';
import { StatusContext, StatusEnum, TaskContext } from "./TaskContext";
import { axiosInstance } from "./axios/axiosInstance";
import { AxiosResponse } from "axios";

function AnswerZone() {
  const [xml, setXml] = useState<string>(`
    <xml xmlns="http://www.w3.org/1999/xhtml">
      
    </xml>
          `);

  const [taskCondition, setTaskCondition] = useContext(TaskContext)
  const [status, setStatus] = useContext(StatusContext)
  const toolboxConf = {
    // "kind": "flyoutToolbox",
    "contents": [
      {
        "kind": "block",
        "type": "start_expression_element",
      },
      {
        "kind": "block",
        "type": "expression_element",
        "fields": {
          "operator": ".",

        }
      },
      {
        "kind": "block",
        "type": "expression_element",
        "fields": {
          "operator": "->",
        }
      },
      {
        "kind": "block",
        "type": "square_brackets",
      },
      {
        "kind": "block",
        "type": "around_brackets",
        "fields": {
          "operator": "*",
          "after_operator": "*"
        }
      },
      {
        "kind": "block",
        "type": "around_brackets_with_inner_operator",
        "fields": {
          "operator": "->*",
        },
      },
      {
        "kind": "block",
        "type": "around_brackets_with_inner_operator",
        "fields": {
          "operator": ".*",
        },
      },
    ]
  }

  useEffect(() => {
    Blockly.Extensions.unregister('operand_menu_extension')
    Blockly.Extensions.register('operand_menu_extension', function() {
      const operandPlace = this.getInput('operand_place')
      console.log(taskCondition)
      if (taskCondition.condition != '') {
        console.log(taskCondition.operands)

        operandPlace.appendField(new Blockly.FieldDropdown( taskCondition.operands), 'operand');
      }
    })

    document.dispatchEvent(new CustomEvent('operandupdate'))
  }, [taskCondition])

  let loaderClass = 'hidden'
  if (status.status == StatusEnum.success) {
    loaderClass = 'absolute h-full w-full top-0 left-0 bg-white opacity-60 z-30'
  }

  return (
    <div className="w-full">
      <div className="font-sans text-base font-medium">
        Текущий ответ
      </div>
      <div className="blocklyDiv">
        <BlocklyWorkspace
          className="w-full h-full absolute" // you can use whatever classes are appropriate for your app's CSS
          toolboxConfiguration={toolboxConf} // this must be a JSON toolbox definition
          initialXml={xml}
          onInject={(workspace: WorkspaceSvg) => {
            
            workspace.addChangeListener(async (event) => {
              console.log(event.type)

              let hasStartElement = false
              workspace.getTopBlocks(true).forEach((block) => {
                if (block.type == 'start_block') {
                  hasStartElement = true
                }
              })

              if (event.type == 'move' && event.oldInputName == undefined && !hasStartElement) 
                {
                let topBlocks = workspace.getTopBlocks(false)
                if (topBlocks.length > 1) {
                  topBlocks.forEach((block) => {
                    if (block.isEditable()) {
                      if (workspace.getTopBlocks(false).indexOf(block) != -1)
                        block.dispose()
                    }
                  })

                  setStatus({
                    status : StatusEnum.error,
                    text : 'В пространстве ответа не должно быть больше одного корневого узла'
                  })
                  workspace.render()
                } else {
                  let code = jsonGenerator.workspaceToCode(workspace)

                  if (code) {
                    let response = await axiosInstance.post('/checkAnswer/', code, {
                      headers: {
                        "Access-Control-Allow-Origin": "*",
                        'Content-Type': 'application/json',
                      }}).catch((error) => {
                        workspace.getAllBlocks(true).forEach((block) => {
                          if (block.isEditable()) {
                            block.getConnections_(true).forEach((connection) => {
                              connection.disconnectInternal(true)
                            })
                            block.dispose(true, true)
                          }
                        })
  
                        workspace.render()
                      })

                      if ((response instanceof Object) && response.status == 200 && !response.data['status']) {
                      setStatus({
                        status : StatusEnum.error,
                        text : response.data['message']
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
                      workspace.getAllBlocks(true).forEach((block) => {
                        if (block.isEditable()) {
                          block.setEditable(false)
                          block.setDeletable(false)

                          if (block.getParent()) {
                            block.setMovable(false)
                          }

                          if (block.type == "around_brackets" || block.type == "around_brackets_with_inner_operator") {
                            let childBlock = block.getInputTargetBlock('firstOperand')
                            while (childBlock.getInputTargetBlock('next')) {
                              childBlock = childBlock.getInputTargetBlock('next')
                            }
                            let endBlock = new Blockly.BlockSvg(workspace, 'end_block')
                            childBlock.getInput('next').connection.connect(endBlock.outputConnection)
                            endBlock.setEditable(false)
                            endBlock.setDeletable(false)
                            endBlock.setMovable(false)
                            endBlock.render()
                          }
                        }
                      })
                      // workspace.render()
                      setStatus({
                        status: StatusEnum.none,
                        text: ''
                      })
                    }
                  }
                }
              }
            })

            document.addEventListener('operandupdate', (event) => {
              (Blockly.getMainWorkspace() as WorkspaceSvg).updateToolbox(toolboxConf);
              (Blockly.getMainWorkspace() as WorkspaceSvg).render();
            })
          }}
          workspaceConfiguration={{
            readOnly: false,
            trashcan: false,
            move: {
              scrollbars: true,
              drag: true,
              wheel: true
            },
            rtl: false,
            // toolbox: toolboxConf
          }}
        />
        <div className={loaderClass}></div>
      </div>

      {/* <div className={'font-sans text-base border ' + (isError?'border-red-500':'border-lime-500') + ' rounded-xl px-5 py-4 ' + (isError?'bg-red-100':'bg-lime-100')}>
          {text}
        </div> */}
    </div>
  );
}

export default AnswerZone;
