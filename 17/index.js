var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');
var md5 = require('../05/md5.js');

var input = 'qljzarfv';
var target = [3,3];
var maxSteps = 150;
var part2 = true;

var mazeGrid = [
  '#########',
  '# | | | #',
  '#-#-#-#-#',
  '# | | | #',
  '#-#-#-#-#',
  '# | | | #',
  '#-#-#-#-#',
  '# | | | #',
  '#########',
];

function printGrid(grid) {
  for(var y = 0; y < grid.length; y++) {
    console.log(grid[y]);
  }
}

// [x, y]
var startPosition = [0, 0];
printGrid(mazeGrid);


/*** PUZZLE **/
function isEqual(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}
function isValidOption(grid, position, delta, hash) {
  var x = position[0] * 2;
  var y = position[1] * 2;
  x++; y++; //border offset
  x += delta.x; y += delta.y;
  return grid[y] &&
         grid[y][x] &&
         (grid[y][x] === '-' || grid[y][x] === '|') &&
         !!hash[delta.hi].match(/[b-f]/);
}
function generateMove(grid, position, delta) {
  return {
    position: [position[0] + delta.x, position[1] + delta.y],
    dir: delta.dir
  };
}
function generateMoves(grid, currentPos, solutionHash) {
  var moves = [];
  _.forEach([
    {x: -1, y: 0, dir: 'L', hi: 2}, {x: 1, y: 0, dir: 'R', hi: 3},
    {x: 0, y: -1, dir: 'U', hi: 0}, {x: 0, y: 1, dir: 'D', hi: 1},
  ], function(delta) {
    if(isValidOption(grid, currentPos, delta, solutionHash)) {
      moves.push(generateMove(grid, currentPos, delta));
    }
  });
  return moves;
}

var currentShortestPath = maxSteps;
var currentLongestPath = 0;
function doMove(currentPos, solution) {
  if(!part2 && solution.length >= currentShortestPath) {
    return false;
  }
  if(isEqual(currentPos, target)) {
    console.log('Found path in ' + solution.length);
    if(solution.length < currentShortestPath) { currentShortestPath = solution.length; }
    if(solution.length > currentLongestPath) {  currentLongestPath = solution.length;  }
    return true;
  }
  var hasValid = false;
  var solutionHash = md5(input + _.map(solution, 'dir').join('')).substr(0, 4);
  var solutions = _.compact(_.map(generateMoves(mazeGrid, currentPos, solutionHash), function(move) {
    var newSolution = solution.concat(move);
    if(doMove(move.position, newSolution)) {
      return newSolution;
    }
  }));

  /* look up shortest solution, and add to current solution */
  if(solutions.length > 0) {
    var bestSolution;
    if(!part2) {
      bestSolution = _.min(solutions, 'length');
    } else {
      bestSolution = _.max(solutions, 'length');
    }
    for(var i = solution.length; i < bestSolution.length; i++) {
      solution.push(bestSolution[i]);
    }
    return true;
  }
  return false;
}

var finalSolution = [];
var foundIt = doMove(startPosition, finalSolution);
if(foundIt) {
  _.forEach(finalSolution, function(solutionRec) {
    console.log('Moving to ' + solutionRec.position);
  });
  console.log('Final path in: ' + finalSolution.length + '');
  console.log('Path : ' + _.map(finalSolution, 'dir').join('') + '');
} else {
  console.log('Path finding failed!');
}
//
// var posCount = 0;
// _.forEach(posMap, function(row) {
//   posCount += (row.join('').match(/%/g) || []).length;
// });
// console.log('Positions: ' + posCount);
