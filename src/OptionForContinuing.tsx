import React from "react";

type Props = {
  operator: string,
  operand?: string,
}

function OptionForContinuing({operator, operand}: Props) {
  let text = operator + (operand ?? '');
    return (
      <div className="px-3.5 py-2.5 font-sans text-base border border-neutral-700 rounded bg-neutral-200 hover:bg-neutral-400">
        {text}
      </div>
    );
  }
  
export default OptionForContinuing;
  