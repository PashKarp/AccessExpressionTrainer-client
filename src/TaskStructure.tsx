import React, { ReactNode } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {TaskElement, TaskElementType} from "./TaskContext";

type Props = {
  elements: Array<TaskElement>,
}

function getTaskElementVisual(taskElement: TaskElement): ReactNode {
  return (
    //<div className='font-sans text-base border rounded-xl px-5 py-4'>
    <>
      {
      taskElement.type == TaskElementType.struct?
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            {taskElement.text}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {taskElement.elements.map((element) => {
            return getTaskElementVisual(element);
          })}
        </AccordionDetails>
      </Accordion>
      :
      <Typography>{taskElement.text}</Typography>
      }
    </>
    //</div>
  );
}

function TaskStructure({elements}:Props) {
    return (
      <div className="w-full">
        <div className="font-sans text-base font-medium">
          Структура данных
        </div>
        <div className='font-sans flex flex-col gap-2.5 text-base border rounded-xl px-5 py-4'>
          {elements.map(element => {
            return getTaskElementVisual(element);
          })}
        </div>
      </div>
    );
  }
  
  export default TaskStructure;
  