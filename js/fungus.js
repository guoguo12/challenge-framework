/*
FUNGUS.JS - Structural decomposer for JavaScript
Allen Guo

Requires esprima.js.
*/

var fungus = {};

// If statements are handled separately since they have a different structure
var validBlockElements = {'ForStatement': 'for',
                          'WhileStatement': 'while',
                          'FunctionDeclaration': 'function'}

var validNonBlockElements = {'VariableDeclaration': 'var'}

/*
Returns if the given test passes on the given code.
 - type must be one of "must-match", "must-contain", "must-not-match", or "must-not-contain"
 - structexp is a valid regex string for searching/matching a structural expression string
 - code is the JS code to be tested
*/
fungus.test = function(type, structexp, code) {
  var codeStructexp = fungus.decompose(code);
  structexp = structexp.replace(/\(/g, '\\(');
  structexp = structexp.replace(/\)/g, '\\)');
  if (type === 'must-match') {
    return new RegExp('^' + structexp + '$').test(codeStructexp);
  }
  if (type === 'must-not-match') {
    return !(new RegExp('^' + structexp + '$').test(codeStructexp));
  }
  if (type === 'must-contain') {
    return new RegExp(structexp).test(codeStructexp);
  }
  if (type === 'must-not-contain') {
    return !(new RegExp(structexp).test(codeStructexp));
  }
  console.error('Invalid type passed to fungus.test()');
  return false; // For bug-tolerance
}

/*
Decomposes the given JS code string into a structural expression.
See the project description (README.md) for more details.
*/
fungus.decompose = function(code) {
  var programNode = esprima.parse(code);
  console.log(programNode);
  var result = fungus.decomposeNode(programNode);
  console.log('Parsed structexp: ' + result);
  return result;
}

/*
Recursively decomposes the given node and all children. (Wow, that's morbid.)
*/
fungus.decomposeNode = function(node) {
  if (node.type === 'Program') {
    return fungus.trim(fungus.decomposeForest(node.body));
  }
  if (node.type === 'IfStatement') {
    var result = '(if' + fungus.decomposeForest(node.consequent.body);
    if (node.alternate) {
      return result + ') (else' + fungus.decomposeForest(node.alternate.body) + ')';
    } else {
      return result + ')';
    }
  }
  if (validBlockElements[node.type] !== undefined) {
    console.log('Found block element: ' + node.type);
    return '(' + validBlockElements[node.type] + fungus.decomposeForest(node.body.body) + ')';
  }
  if (validNonBlockElements[node.type] !== undefined) {
    console.log('Found non-block element: ' + node.type);
    return validNonBlockElements[node.type];
  }
  return '';
}

/*
Recursively decomposes the given forest (list) of nodes.
*/
fungus.decomposeForest = function(nodes) {
  var result = '';
  for (var i = 0; i < nodes.length; i++) {
    var nodeString = fungus.decomposeNode(nodes[i]);
    if (nodeString !== '') {
      result = result + nodeString + ' ';
    }
  }
  if (result !== '') {
    return ' ' + fungus.trim(result);
  }
  return result;
}

/*
Trims the given string.
*/
fungus.trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
}
