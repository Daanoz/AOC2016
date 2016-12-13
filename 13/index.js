var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = 1362;
var target = [31,39];
var xMax = 55;
var yMax = 50;
var maxSteps = (true /*part 2 */)?50:120;
// input = 10;
// target = [7,4];
// xMax = 10;
// yMax = 7;

var mazeGrid = [];

for(var y = 0; y < yMax; y++) {
  mazeGrid[y] = [];
  for(var x = 0; x < xMax; x++) {
    var wallVal = (x*x) + (3*x) + (2*x*y) + y + (y*y);
    wallVal += input;
    var binWallVall = (wallVal >>> 0).toString(2);
    mazeGrid[y][x] = (binWallVall.match(/1/g) || []).length % 2 == 0 ? '.' : '#';
  }
}

function printGrid(grid) {
  var coordRow1 = '';
  var coordRow2 = '';
  for(var x = 0; x < xMax; x++) {
    coordRow1 += x > 9 ? (''+x).substr(0,1) : ' ';
    coordRow2 += (x % 10);
  }
  console.log('   ' + coordRow1);
  console.log('   ' + coordRow2);
  for(var y = 0; y < yMax; y++) {
    var row = y < 10 ? ' ' : '';
    row += y + ' ';
    for(var x = 0; x < xMax; x++) {
      if(x === target[0] && y === target[1]) {
        row += grid[y][x]==='#'?'@':'_';
      } else {
        row += grid[y][x] + '';
      }
    }
    console.log(row);
  }
}

// [x, y]
var startPosition = [1, 1];
mazeGrid[startPosition[0]][startPosition[1]] = '%';
printGrid(mazeGrid);

/*** PUZZLE **/
function isEqual(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}
function isValidOption(grid, x, y) {
  return grid[y] && grid[y][x] && grid[y][x] === '.';
}
function generateMove(grid, x, y) {
  var newGrid = _.cloneDeep(grid);
  newGrid[y][x] = '%';
  return {
    position: [x, y],
    grid: newGrid
  };
}
function generateMoves(grid, currentPos) {
  var moves = [];
  _.forEach([
    {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1},
  ], function(delta) {
    if(isValidOption(grid, currentPos[0] + delta.x, currentPos[1] + delta.y)) {
      moves.push(generateMove(grid, currentPos[0] + delta.x, currentPos[1] + delta.y));
    }
  });
  return moves;
}

var currentShortestPath = maxSteps;
var posMap = _.cloneDeep(mazeGrid);
function doMove(currentPos, currentGrid, solution) {
  posMap[currentPos[1]][currentPos[0]] = '%';
  if(solution.length >= currentShortestPath) {
    return false;
  }
  if(isEqual(currentPos, target)) {
    console.log('Found path in ' + solution.length);
    currentShortestPath = solution.length;
    return true;
  }
  var hasValid = false;
  var solutions = _.compact(_.map(generateMoves(currentGrid, currentPos), function(move) {
    var newSolution = solution.concat(move);
    if(doMove(move.position, move.grid, newSolution)) {
      return newSolution;
    }
  }));

  /* look up shortest solution, and add to current solution */
  if(solutions.length > 0) {
    var shortest = _.min(solutions, 'length');
    for(var i = solution.length; i < shortest.length; i++) {
      solution.push(shortest[i]);
    }
    return true;
  }
  return false;
}

var finalSolution = [];
var foundIt = doMove(startPosition, mazeGrid, finalSolution);
if(foundIt) {
  _.forEach(finalSolution, function(solutionRec) {
    console.log('Moving to ' + solutionRec.position);
    printGrid(solutionRec.grid);
  });
  console.log('Final path in: ' + finalSolution.length + '');
} else {
  console.log('Path finding failed!');
}

var posCount = 0;
_.forEach(posMap, function(row) {
  posCount += (row.join('').match(/%/g) || []).length;
});
console.log('Positions: ' + posCount);
