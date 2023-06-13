/**
 * @license
 * 
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks


import * as Blockly from 'blockly/core';
import { axiosInstance } from '../axios/axiosInstance';

// Since we're using json to initialize the field, we'll need to import it.
// import '../fields/BlocklyReactField';
// import '../fields/DateField';

// import '@blockly/field-date';

let reactExpressionBlock = {
  "type": "expression_element",
  "message0": "%1%2 %3",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "operator",
      "text": "."
    },
    {
      "type": "input_dummy",
      "name": "operand_place",
    },
    {
      "type": "input_value",
      "name": "next",
      "check": "expression_element"
    }
  ],
  "inputsInline": true,
  "output": "expression_element",
  "colour": 230,
  "tooltip": "",
  "helpUrl": "",
  "extensions": ["operand_menu_extension"]
};

Blockly.Blocks['expression_element'] = {
  init: function () {
    this.jsonInit(reactExpressionBlock);
    this.setStyle('loop_blocks');
  }
}

let reactStartExpressionBlock = {
  "type": "start_expression_element",
  "message0": "%1 %2",
  "args0": [
    {
      "type": "input_dummy",
      "name": "operand_place",
    },
    {
      "type": "input_value",
      "name": "next",
      "check": "expression_element"
    }
  ],
  "inputsInline": true,
  "output": "start_expression_element",
  "colour": 230,
  "tooltip": "",
  "helpUrl": "",
  "extensions": ["operand_menu_extension"]
};

Blockly.Blocks['start_expression_element'] = {
  init: function () {
    this.jsonInit(reactStartExpressionBlock);
    this.setStyle('loop_blocks');
  }
}

let reactRoundBrackets = {
  "type": "around_brackets",
  "message0": "%1(%2)%3",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "operator",
      "text": ""
    },
    {
      "type": "input_value",
      "name": "firstOperand",
      "check": "start_expression_element"
    },
    {
      "type": "input_value",
      "name": "next",
      "check": "expression_element"
    }
  ],
  "inputsInline": true,
  "output": "start_expression_element",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

Blockly.Blocks['around_brackets'] = {
  init: function () {
    this.jsonInit(reactRoundBrackets);
    this.setStyle('loop_blocks');
  }
}

let reactSquareBrackets = {
  "type": "square_brackets",
  "message0": "[%1]%2",
  "args0": [
    {
      "type": "input_dummy",
      "name": "operand_place",
    },
    {
      "type": "input_value",
      "name": "next",
      "check": "expression_element"
    }
  ],
  "inputsInline": true,
  "output": "expression_element",
  "colour": 230,
  "tooltip": "",
  "helpUrl": "",
  "extensions": ["operand_menu_extension"]
}

Blockly.Blocks['square_brackets'] = {
  init: function () {
    this.jsonInit(reactSquareBrackets);
    this.setStyle('loop_blocks');
  }
}

let reactEndBlock = {
  "type": "end_block",
  "message0": "",
  "output": "expression_element",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

Blockly.Blocks['end_block'] = {
  init: function () {
    this.jsonInit(reactEndBlock);
    this.setStyle('loop_blocks');
  }
}

let reactStartBlock = {
  "type": "start_block",
  "message0": "%1",
  "args0": [
    {
      "type": "input_value",
      "name": "next",
      "check": "start_expression_element"
    }
  ],
  "inputsInline": false,
  "colour": 260,
  "tooltip": "",
  "helpUrl": ""
}

Blockly.Blocks['start_block'] = {
  init: function () {
    this.jsonInit(reactStartBlock);
    this.setStyle('loop_blocks');
  }
}

let reactRoundBracketsWithInnerOperator = {
  "type": "around_brackets_with_inner_operator",
  "message0": "(%1%2%3)%4",
  "args0": [
    {
      "type": "input_value",
      "name": "firstOperand",
      "check": "start_expression_element"
    },
    {
      "type": "field_label_serializable",
      "name": "operator",
      "text": ""
    },
    {
      "type": "input_dummy",
      "name": "operand_place",
    },
    {
      "type": "input_value",
      "name": "next",
      "check": "expression_element"
    }
  ],
  "inputsInline": true,
  "output": "start_expression_element",
  "colour": 230,
  "tooltip": "",
  "helpUrl": "",
  "extensions": ["operand_menu_extension"]
}

Blockly.Blocks['around_brackets_with_inner_operator'] = {
  init: function () {
    this.jsonInit(reactRoundBracketsWithInnerOperator);
    this.setStyle('loop_blocks');
  }
}


Blockly.Extensions.register('operand_menu_extension',
  async function () {
    const operandPlace = this.getInput('operand_place')

    operandPlace.appendField(new Blockly.FieldDropdown( [['a', '0']] ), 'operand');
  });