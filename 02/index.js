var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();

var grid_1 = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
];
var grid_2 = [
  ['',  '',  '1', '',  '' ],
  ['',  '2', '3', '4', '' ],
  ['5', '6', '7', '8', '9'],
  ['',  'A', 'B', 'C', '' ],
  ['',  '',  'D', '',  '' ]
];
var grid = grid_2;

var output = '';
var position = {x: 1, y: 1};

function getKey(keyPosition) {
  if(!grid[keyPosition.y]) { return; }
  return grid[keyPosition.y][keyPosition.x];
}
function applyValue(current, mod) {
  if(mod === 0) { return current; }
  current += mod;
  //if(current < 0) { return 0; }
  //if(current > 2) { return 2; }
  return current;
}
function checkPosition(newPosition, oldPosition) {
  if(!getKey(newPosition)) {
    return oldPosition;
  }
  return newPosition;
}

_.forEach(input, function(keypadInput) {
  if(keypadInput.length <= 0) { return; }
  for(var x = 0; x < keypadInput.length; x++) {
    var xMod = 0;
    var yMod = 0;
    switch(keypadInput[x]) {
      case 'U': { yMod--; } break;
      case 'L': { xMod--; } break;
      case 'R': { xMod++; } break;
      case 'D': { yMod++; } break;
    }
    var before = _.clone(position);
    position.x = applyValue(position.x, xMod);
    position.y = applyValue(position.y, yMod);
    position = checkPosition(position, before);
  }
  output += getKey(position);
});

console.log(output);
