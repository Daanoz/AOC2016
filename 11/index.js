var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();
// var input = [
//   'The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.',
//   'The second floor contains a hydrogen generator.',
//   'The third floor contains a lithium generator.',
//   'The fourth floor contains nothing relevant.'
// ];

var elevatorPos = 1;

var floorRegex = /The (\w*) floor contains /i;
var elementRegex = /a (?:(\w*) generator|(\w*)-compatible microchip)/gi;

var elements = [];
var elementTypeList = [];
var floorNumbers = [4, 3, 2, 1];
var floors = {};
_.forEach(floorNumbers, function(floorNumber) {
  floors[floorNumber] = [];
});

function drawFloors(floorState, currentElevatorPos) {
  _.forEach(floorNumbers, function(floorNumber) {
    var str = 'F' + floorNumber + ' ';
    str += currentElevatorPos === floorNumber ? 'E ' : '. ';
    _.forEach(elements, function(element) {
      str += floorState[floorNumber].indexOf(element) >= 0 ? element + ' ' : ' .  ';
    });
    console.log(str);
  });
  console.log('-'.repeat((elements.length * 4) + 5));
}

function getFloorNumber(floorStr) {
  switch(floorStr) {
    case 'first'  : { return 1; }
    case 'second' : { return 2; }
    case 'third'  : { return 3; }
    case 'fourth' : { return 4; }
  }
}

_.forEach(input, function(floorInput) {
  var floorMatch = floorRegex.exec(floorInput);
  if(floorMatch) {
    var floorNumber = getFloorNumber(floorMatch[1]);
    var elementList = floorInput.replace(floorRegex, '');
    var elementMatch = null;
    while(elementMatch = elementRegex.exec(elementList)) {
      var elementKey;
      if(elementMatch[1]) {
        elementKey = 'G' + elementMatch[1].substr(0,2).toUpperCase();
      } else {
        elementKey = 'M' + elementMatch[2].substr(0,2).toUpperCase();
      }
      if(elementTypeList.indexOf(elementKey.substr(1,2)) < 0) {
        elementTypeList.push(elementKey.substr(1,2));
      }
      elements.push(elementKey);
      floors[floorNumber].push(elementKey);
    }
  }
});
if(true /* part 2 */) {
  floors[1].push('GEL');
  floors[1].push('MEL');
  floors[1].push('GDI');
  floors[1].push('MDI');
  elements.push('GEL');
  elements.push('MEL');
  elements.push('GDI');
  elements.push('MDI');
  elementTypeList.push('EL');
  elementTypeList.push('DI');
}
elements.sort();
console.log('Starting with: ');
drawFloors(floors, elevatorPos);

/**************************** puzzle solving *********************/

function isCurrentStateValid(floorState) {
  var isValid = true;
  _.forEach(floorNumbers, function(floorNumber) {
    var floorElements = floorState[floorNumber];
    var generators = _.filter(floorElements, function(element) {
      return element.substr(0,1) === 'G';
    });
    if(generators.length < 1 || generators.length === floorElements.length) {
      return true;
    }
    var chips = _.filter(floorElements, function(element) {
      return element.substr(0,1) === 'M';
    });
    _.forEach(chips, function(chip) {
      if(floorElements.indexOf('G' + chip.substr(1,2)) < 0) {
        isValid = false;
      }
      return isValid;
    });
    return isValid;
  });
  return isValid;
}

function areWeThereYet(floorState) {
  return floorState[4].length === elements.length;
}

var moveCombis = {};
function generateMoveCombinations(floorElements) {
  var elementHash = floorElements.sort().join(',');
  if(moveCombis[elementHash]) {
    return moveCombis[elementHash];
  }
  var combinations = {};
  _.forEach(floorElements, function(firstFloorElement) {
    _.forEach(floorElements, function(secondFloorElement) {
      if(firstFloorElement === secondFloorElement) {
        combinations[firstFloorElement] = [firstFloorElement];
      } else {
        var elementSet = [firstFloorElement, secondFloorElement].sort();
        combinations[elementSet.join(',')] = elementSet;
      }
    });
  });
  moveCombis[elementHash] = _.values(combinations);
  return moveCombis[elementHash];
}

function updateFloorState(floorState, currentFloor, modifier, floorElements) {
  var newFloorState = _.cloneDeep(floorState);
  _.forEach(floorElements, function(floorElement) {
    _.pull(newFloorState[currentFloor], floorElement);
    newFloorState[currentFloor + modifier].push(floorElement);
  });
  return newFloorState;
}

// generates loosely matchable hash, slower than accurate one!
function generateAbstractFloorHash(floorState) {
  var hash = '';
  var typeIndex = 0;
  var typeMap = {};
  _.forEach(floorNumbers, function(floorNumber) {
    var floorElements = floorState[floorNumber];
    var remappedElements = _.map(floorElements.sort(), function(floorElement) {
      var type = floorElement.substr(1,2);
      if(!typeMap[type]) {
        typeMap[type] = elementTypeList[typeIndex];
        typeIndex++;
      }
      return floorElement.substr(0,1) + typeMap[type];
    });

    hash += 'F' + floorNumber + ':' + (remappedElements.sort().join(','));
  });
  return hash;
}

// floor setup hash, faster than abstract one
function generateFloorHash(floorState) {
  var hash = '';
  var types = [];
  _.forEach(floorNumbers, function(floorNumber) {
    var floorElements = floorState[floorNumber];
    hash += 'F' + floorNumber + ':' + (floorElements.sort().join(','));
  });
  return hash;
}

function beenThereDoneThat(solution, floorStateHash) {
  return !!_.find(solution, function(solutionRecord) {
    return solutionRecord.hash === floorStateHash;
  });
}

// avoids call stack size overloads, rough estimated 85 should do the trick
var currentShortestPath = 85;
var invalidPaths = 0;
var lastUpdate = new Date();

var floorHashValids = {};
var floorHashSteps = {};
function makeMove(floorState, currentElevatorPos, solution) {
  /* do we already have a finish shorter path? */
  if(solution.length > currentShortestPath) {
    invalidPaths++;
    return false;
  }

  /* did we already pass a similar setup with less steps? */
  var currentFloorHash = currentElevatorPos + generateAbstractFloorHash(floorState);
  if(!floorHashSteps[currentFloorHash]) {
    floorHashSteps[currentFloorHash] = {
      steps: solution.length,
      state: floorState
    };
  } else {
    if(floorHashSteps[currentFloorHash].steps <= solution.length) {
      invalidPaths++;
      return false;
    } else {
      floorHashSteps[currentFloorHash].steps = solution.length;
    }
  }

  /* Maybe we are already there? */
  if(areWeThereYet(floorState)) {
    if(solution.length < currentShortestPath) {
      currentShortestPath = solution.length;
    }
    console.log('Found path! Takes ' + solution.length + ' steps');
    return true;
  }

  /* is our hash already marked as invalid? skip the check, and fail! */
  if(typeof floorHashValids[currentFloorHash] === 'boolean') {
    if(!floorHashValids[currentFloorHash]) {
      invalidPaths++;
      return false;
    }
  } else {
    if(!isCurrentStateValid(floorState)) {
      floorHashValids[currentFloorHash] = false;
      invalidPaths++;
      if(lastUpdate.getTime() + 5000 < new Date().getTime()) {
        var hrsubend = process.hrtime(hrstart);
        console.log(invalidPaths + ' invalidPaths found, ' + Math.round(invalidPaths/hrsubend[0]) + ' invalid paths per second.', 'Running for: ' + hrsubend[0] + 's');
        lastUpdate = new Date();
      }
      return false;
    } else {
      floorHashValids[currentFloorHash] = true;
    }
  }

  /* lets generate all possible combinations for this floor to move */
  var combinations = generateMoveCombinations(floorState[currentElevatorPos]);

  /* if a floor is empty, why bother revisiting? */
  var minFloor = 1;
  if(floorState[1].length < 1) {
    minFloor = 2;
    if(floorState[2].length < 1) {
      minFloor = 3;
    }
  }

  /* lets try our combinations going up and down */
  var solutions = [];
  _.forEach(combinations, function(combination) {
    _.forEach([-1, 1], function(floorDelta) {
      var newElevatorPos = currentElevatorPos + floorDelta;
      if(newElevatorPos >= minFloor && newElevatorPos <= 4) {
        var newFloorState = updateFloorState(floorState, currentElevatorPos, floorDelta, combination);
        var newFloorHash = generateFloorHash(newFloorState);
        if(!beenThereDoneThat(solution, newFloorHash)) { // we have already been to this setup with this solution, lets not start an eternal loop here
          var solutionRec = {
            e: newElevatorPos,
            direction: floorDelta > 1? 'UP' : 'DOWN',
            elements: combination, state: newFloorState, hash: newFloorHash
          };
          var newSolution = solution.concat(solutionRec);
          if(makeMove(newFloorState, newElevatorPos, newSolution)) {
            solutions.push(newSolution);
          }
        }
      }
    });
  });

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
var hrstart = process.hrtime();
var foundIt = makeMove(floors, elevatorPos, finalSolution);
var hrend = process.hrtime(hrstart);
_.forEach(finalSolution, function(solutionRec) {
  console.log('Moving ' + solutionRec.direction + ' elements: ' + solutionRec.elements.join(', '));
  drawFloors(solutionRec.state, solutionRec.e);
});
console.log('Final path in: ' + finalSolution.length + ', it took: ' + hrend[0] + 's ' + hrend[1]/1000000 + 'ms');
