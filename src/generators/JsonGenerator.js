import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');
jsonGenerator.PRECEDENCE = 0;

function getElementJSON(typeV, operandV, secondOperandV, operatorV, nextV) {

    if (typeof operandV != 'object') {
        operandV = {
            type : operandV,
            operand : null,
            secondOperand : null,
            operator : null,
            next : null
        }
    }

    return JSON.stringify({
        type : typeV,
        operand : operandV,
        secondOperand : secondOperandV,
        operator : operatorV,
        next : nextV
    })
}

jsonGenerator['start_expression_element'] = function(block) {
    const type = 'start_element_expression'
    const operand = block.getFieldValue('operand')
    const secondOperand = null
    const operator = null
    let next = jsonGenerator.valueToCode(block, 'next', jsonGenerator.PRECEDENCE)
    if (next) {
        next = JSON.parse(next)
    }else {
        next = null
    }
    const elementString = getElementJSON(type, operand, secondOperand, operator, next)
    return [elementString, jsonGenerator.PRECEDENCE]
}

jsonGenerator['expression_element'] = function(block) {
    const type = 'element_expression'
    const operand = block.getFieldValue('operand')
    const secondOperand = null
    const operator = block.getFieldValue('operator')
    let next = jsonGenerator.valueToCode(block, 'next', jsonGenerator.PRECEDENCE)
    if (next) {
        next = JSON.parse(next)
    } else {
        next = null
    }
    const elementString = getElementJSON(type, operand, secondOperand, operator, next)
    return [elementString, jsonGenerator.PRECEDENCE]
}

jsonGenerator['square_brackets'] = function(block) {
    const type = 'element_expression'
    const operand = block.getFieldValue('operand')
    const secondOperand = null
    const operator = '[]'
    let next = jsonGenerator.valueToCode(block, 'next', jsonGenerator.PRECEDENCE)
    if (next) {
        next = JSON.parse(next)
    } else {
        next = null
    }
    const elementString = getElementJSON(type, operand, secondOperand, operator, next)
    return [elementString, jsonGenerator.PRECEDENCE]
}

jsonGenerator['around_brackets'] = function(block) {
    const type = 'around_brackets'
    let operand = jsonGenerator.valueToCode(block, 'firstOperand', jsonGenerator.PRECEDENCE)
    if (operand) {
        operand = JSON.parse(operand)
    } else {
        operand = null
    }
    const operator = block.getFieldValue('operator')
    const secondOperand = null
    let next = jsonGenerator.valueToCode(block, 'next', jsonGenerator.PRECEDENCE)
    if (next) {
        next = JSON.parse(next)
    } else {
        next = null
    }
    const elementString = getElementJSON(type, operand, secondOperand, operator, next)
    return [elementString, jsonGenerator.PRECEDENCE]
}

jsonGenerator['end_block'] = function(block) {
    return [null, jsonGenerator.PRECEDENCE]
}

jsonGenerator['around_brackets_with_inner_operator'] = function(block) {
    const type = 'around_brackets_with_inner_operator'
    let operand = jsonGenerator.valueToCode(block, 'firstOperand', jsonGenerator.PRECEDENCE)
    if (operand) {
        operand = JSON.parse(operand)
    } else {
        operand = null
    }
    const operator = block.getFieldValue('operator')
    const secondOperand =  block.getFieldValue('operand')
    let next = jsonGenerator.valueToCode(block, 'next', jsonGenerator.PRECEDENCE)
    if (next) {
        next = JSON.parse(next)
    }else {
        next = null
    }
    const elementString = getElementJSON(type, operand, secondOperand, operator, next)
    return [elementString, jsonGenerator.PRECEDENCE]
}

jsonGenerator['start_block'] = function(block) {
    return [jsonGenerator.valueToCode(block, 'next', jsonGenerator.PRECEDENCE), jsonGenerator.PRECEDENCE]
}