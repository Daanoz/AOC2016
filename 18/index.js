var _ = require('../utils/lodash.js');

var input = '.^^^^^.^^.^^^.^...^..^^.^.^..^^^^^^^^^^..^...^^.^..^^^^..^^^^...^.^.^^^^^^^^....^..^^^^^^.^^^.^^^.^^';
//input = '.^^.^.^^^^';
var rows = 400000;

function onlyLeftIsTrap(position, inputData) {
  return inputData[position-1] === '^' && inputData[position+1] !== '^';
}
function onlyRightIsTrap(position, inputData) {
  return inputData[position+1] === '^' && inputData[position-1] !== '^';
}

function isTrap(position, inputData) {
  if (onlyLeftIsTrap(position, inputData) || onlyRightIsTrap(position, inputData)) {
    // we don't care about center
    return true;
  }
  return false;
}

var roomGrid = [input];
while(roomGrid.length < rows) {
  var lastRow = roomGrid[roomGrid.length - 1];
  var newRow = '';
  for(var x = 0; x < lastRow.length; x++) {
    newRow += isTrap(x, lastRow)?'^':'.';
  }
  roomGrid.push(newRow);
}

var count = 0;
_.forEach(roomGrid, function(row) {
  console.log(row);
  count += (row.match(/\./g) || []).length;
});

console.log('There are ' + count + ' safe tiles');
