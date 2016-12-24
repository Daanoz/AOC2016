var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
};

var input = utils.readNewLineSeperatedInput();
// input = [
//   '###########',
//   '#0.1.....2#',
//   '#.#######.#',
//   '#4.......3#',
//   '###########',
//   ''
// ];

var locations = {};
_.forEach(input, function(inputLine, yIndex) {
  var match = null;
  var re = /(\d)/g;
  while ((match = re.exec(inputLine)) !== null) {
    locations[match[1]] = [match.index, yIndex];
  }
});
var puzzleGrid = input;

function isValidOption(grid, x, y) {
  return grid[y] && grid[y][x] && /[0-9\.\*]/.test(grid[y][x]);
}
function getValidOptions(grid, currentPos) {
  var moves = [];
  _.forEach([
    {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1},
  ], function(delta) {
    if(isValidOption(grid, currentPos[0] + delta.x, currentPos[1] + delta.y)) {
      moves.push([currentPos[0] + delta.x, currentPos[1] + delta.y]);
    }
  });
  return moves;
}
function isEqual(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

function discardDeadEnd(position, nextMove) {
  puzzleGrid[position[1]] = puzzleGrid[position[1]].replaceAt(position[0], '#');
  var moves = getValidOptions(puzzleGrid, nextMove);
  if(moves.length === 1) { // this must be a dead end
    discardDeadEnd(nextMove, moves[0]);
  }
}

function removeDeadEnds() {
  for(var y = 0; y < puzzleGrid.length; y++) {
    for(var x = 0; x < puzzleGrid[0].length; x++) {
      if(puzzleGrid[y][x] === '.') {
        var moves = getValidOptions(puzzleGrid, [x, y]);
        if(moves.length === 1) { // this must be a dead end
          discardDeadEnd([x, y], moves[0]);
        }
      }
    }
  }
}
removeDeadEnds();

function floodGrid(start, inputGrid) {
  var posMap = [];
  for(var y = 0; y < inputGrid.length; y++) {
    posMap[y] = [];
    for(var x = 0; x < inputGrid[0].length; x++) {
      posMap[y][x] = 999;
    }
  }

  function generateMove(x, y) {
    return [x, y];
  }
  function generateMoves(currentPos) {
    var moves = [];
    _.forEach([
      {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1},
    ], function(delta) {
      if(isValidOption(inputGrid, currentPos[0] + delta.x, currentPos[1] + delta.y)) {
        moves.push(generateMove(currentPos[0] + delta.x, currentPos[1] + delta.y));
      }
    });
    return moves;
  }

  function doMove(positions, pathLength) {
    var nextMoves = [];
    _.forEach(positions, function (position) {
      if(posMap[position[1]][position[0]] > pathLength) {
        posMap[position[1]][position[0]] = pathLength;
        _.forEach(generateMoves(position), function(nextMove) {
          nextMoves.push(nextMove);
        });
      }
    });
    if(nextMoves.length < 1) { return ; }
    doMove(nextMoves, pathLength + 1);
  }
  doMove([start], 0);

  return _.map(locations, function(location, locationIndex) {
    return posMap[location[1]][location[0]];
  });
}
var zeroLocation = locations[0];
var distanceMap = {};
_.forEach(locations, function(location, locationIndex) {
  distanceMap[locationIndex] = floodGrid(location, puzzleGrid);
});
console.log(distanceMap);

var list = [];
function traversePath(destination, visited, currentDistance) {
  var path = [destination].concat(visited);
  var nextSteps = [];
  _.forEach(distanceMap[destination], function(distance, location) {
    if((distance > 0) && // probably we are already here
       (location !== 0) && // we don't want to travel to our start
       _.indexOf(visited, location) < 0) {
      traversePath(location, path, currentDistance + distance);
      nextSteps.push(location);
    }
  });
  if(nextSteps.length < 1 && path.length === _.keys(distanceMap).length) {
    list.push({path: path.reverse(), distance: currentDistance});
  }
}

_.forEach(distanceMap[0], function(destination, destinationIndex) {
  traversePath(destinationIndex, [], 0);
});

console.log('Part 1:', _.minBy(list, 'distance'));

// lets append the route back
_.forEach(list, function(result) {
  var endPos = result.path[result.path.length - 1];
  result.path.push(0);
  result.distance += distanceMap[endPos][0];
});

console.log('Part 2:', _.minBy(list, 'distance'));
