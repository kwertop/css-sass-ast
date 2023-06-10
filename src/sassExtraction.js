const fs = require('fs');
const gonzales = require('gonzales-pe');
const util = require('util');

// let data = '';
// try {
//   data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
// } catch (err) {
//   console.error(err);
// }

let data = `
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body
  font: 100% $font-stack
  color: $primary-color
`;

function parseSassOrScss(data) {
  let ast;
  try {
    ast = gonzales.parse(data, {syntax: 'scss'});
  }
  catch(err1) {
    try {
      ast = gonzales.parse(data, {syntax: 'sass'});
    }
    catch(err2) {
      ast = [];
    }
  }
  return ast;
}

let variables = {};

function extractVariables(node) {
  
  let variableName = '';
  node.traverseByType('variable', (child, index, parent) => {
    let identNode = child.last('ident');
    variableName = '$' + identNode.content.trim();
  });

  let variableValue = '';
  node.traverseByType('value', (child, index, parent) => {
    variableValue = child.toString();
  });

  variables[variableName] = variableValue;
}

let parsedTree = parseSassOrScss(data);

parsedTree.forEach('declaration', extractVariables);

console.log(variables);