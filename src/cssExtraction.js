const fs = require('fs');
const csstree = require('css-tree');

// let data = '';
// try {
//   data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
// } catch (err) {
//   console.error(err);
// }

let data = `
:root {
  --main-bg-color: #000080;
  --main-text-color: #fff;
}

body {
  font-family: Arial, sans-serif;
  color: #333;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.container .custom-margin {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}`;

const ast = csstree.parse(data);

let cssVariables = {};
let cssClasses = {};

csstree.walk(ast, {
  visit: 'Declaration',
  enter: (node, item, list) => {
    if (node.property.startsWith('--')) {
      const variableName = node.property.slice(2);
      const variableValue = csstree.generate(node.value);
      cssVariables[variableName] = variableValue;
    }
  }
});

csstree.walk(ast, {
  visit: 'Rule',
  enter: (node, item, list) => {
    let selector = csstree.generate(node.prelude);
    selector = selector.trim();

    if (selector.startsWith('.')) {
      const className = selector;
      cssClasses[className] = csstree.generate(node.block);
    }
  }
});

console.log(cssVariables);
console.log(cssClasses);