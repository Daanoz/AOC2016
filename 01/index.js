var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readCommaSeperatedInput();

var startPosition = {x: 0, y: 0, facing: 'N'};
var position = _.clone(startPosition);
var history = {};
var firstDoubleVisit = null;

function updateDirection(direction) {
  var directions = ['N', 'E', 'S', 'W'];
  var currentFacingIndex = directions.indexOf(position.facing);
  switch(direction) {
    case 'L': { currentFacingIndex--; } break;
    case 'R': { currentFacingIndex++;} break;
    default: 'Unknown direction: ' + direction;
  }
  position.facing = directions[(currentFacingIndex + 4) % 4];
}
function updateSteps(steps) {
  var xModifier = 0;
  var yModifier = 0;
  switch(position.facing) {
    case 'N': { yModifier = steps; } break;
    case 'S': { yModifier = -steps; } break;
    case 'E': { xModifier = steps; } break;
    case 'W': { xModifier = -steps; } break;
  }
  for(var x = 0; x < Math.abs(xModifier); x++) {
    position.x += xModifier < 0 ? -1 : 1;
    checkHistory();
  }
  for(var y = 0; y < Math.abs(yModifier); y++) {
    position.y += yModifier < 0 ? -1 : 1;
    checkHistory();
  }
}

function checkHistory() {
  if(!history[position.x]) {
    history[position.x] = {};
  }
  if(!history[position.x][position.y]) {
    history[position.x][position.y] = 1;
  } else {
    history[position.x][position.y]++;
    if(!firstDoubleVisit) {
      firstDoubleVisit = _.clone(position);
      console.log(firstDoubleVisit);
    }
  }
}

_.forEach(input, function(value) {
  var direction = value.substr(0, 1);
  var steps = parseInt(value.substr(1));
  updateDirection(direction);
  updateSteps(steps);

});

console.log(Math.abs(position.x - startPosition.x) + Math.abs(position.y - startPosition.y));
console.log(Math.abs(firstDoubleVisit.x - startPosition.x) + Math.abs(firstDoubleVisit.y - startPosition.y));
