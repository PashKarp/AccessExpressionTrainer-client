import React from "react";
import OptionForContinuing from "./OptionForContinuing";

function OptionsForContinuing() {
    return (
      <div>
        <div className="font-sans text-base font-medium">
          Options for continuing the expression
        </div>
        <div className="flex flex-row flex-wrap gap-x-5 gap-y-3">
          <OptionForContinuing operator={"."} operand={"d"}></OptionForContinuing>
          <OptionForContinuing operator={"->"} operand={"d"}></OptionForContinuing>
          <OptionForContinuing operator={"."} operand={"c"}></OptionForContinuing>
          <OptionForContinuing operator={"->"} operand={"c"}></OptionForContinuing>
          <OptionForContinuing operator={"*"}></OptionForContinuing>
        </div>
      </div>
    );
  }
  
  export default OptionsForContinuing;
  