var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();
var input = [
  'The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.',
  'The second floor contains a hydrogen generator.',
  'The third floor contains a lithium generator.',
  'The fourth floor contains nothing relevant.'
];
// var input = [
//   'The first floor contains a lithium generator, a xet generator, a zat generator, a zat-compatible microchip, a hydrogen-compatible microchip and a hydrogen generator.',
//   'The second floor contains a xet-compatible microchip and a lithium-compatible microchip.',
//   'The third floor contains nothing relevant.',
//   'The fourth floor contains nothing relevant.'
// ];
// var input = [
//   'The first floor contains a lithium generator and a hydrogen generator.',
//   'The second floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.',
//   'The third floor contains nothing relevant.',
//   'The fourth floor contains nothing relevant.'
// ];
var elevatorPos = 1;

var floorRegex = /The (\w*) floor contains /i;
var elementRegex = /a (?:(\w*) generator|(\w*)-compatible microchip)/gi;

var elements = [];
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
  console.log('-'.repeat((elements.length * 3) + 5));
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
      elements.push(elementKey);
      floors[floorNumber].push(elementKey);
    }
  }
});
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
        //console.log('Floor:' + floorNumber + 'is Invalid for ' + chip);
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
        var elements = [firstFloorElement, secondFloorElement].sort();
        combinations[elements.join(',')] = elements;
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

function generateFloorHash(floorState) {
  var hash = '';
  var types = [];
  _.forEach(floorNumbers, function(floorNumber) {
    var floorElements = floorState[floorNumber];
    hash += 'F' + floorNumber + ':' + (floorElements.sort().join(','));
    // _.forEach(floorElements, function(floorElement) {
    //   var type = floorElement.substr(1,2);
    //   var index = types.indexOf(type);
    //   if(index < 0) {
    //     index = types.length;
    //     types.push(type);
    //   }
    //   hash += floorElement.substr(0, 1) + '0' + index + ',';
    // });
  });
  // var counter = 0;
  // var isReplacing = true;
  // var hashRegex = /(G|M)([a-z]{2})(.*)(G|M)\2/i;
  // while(isReplacing) {
  //   counter++;
  //   var beforeHash = hash;
  //   hash = beforeHash.replace(hashRegex, '$1_'+counter+'$3$4_'+counter+'');
  //   if(hash === beforeHash) {
  //     isReplacing = false;
  //   }
  // }
  return hash;
}

function beenThereDoneThat(solution, floorState) {
  var floorStateHash = generateFloorHash(floorState);
  var result = !!_.find(solution, function(solutionRecord) {
    return solutionRecord.hash === floorStateHash;
  });
  return result;
}

// 999 seems already quite long, also avoids call stack size overloads
var currentShortestPath = 75;
var invalidStates = 0;
var lastUpdate = new Date();

var floorHashValids = {};
var floorHashSteps = {};
function makeMove(floorState, currentElevatorPos, solution) {
  if(solution.length > currentShortestPath) {
    return false;
  }

  var currentFloorHash = currentElevatorPos + generateFloorHash(floorState);
  if(!floorHashSteps[currentFloorHash]) {
    floorHashSteps[currentFloorHash] = solution.length;
  } else {
    if(floorHashSteps[currentFloorHash] < solution.length) {
      invalidStates++;
      //return false;
    } else {
      floorHashSteps[currentFloorHash] = solution.length;
    }
  }
  if(areWeThereYet(floorState)) {
    if(solution.length < currentShortestPath) {
      currentShortestPath = solution.length;
    }
    console.log('Found path! Takes ' + solution.length + ' steps');
    return true;
  }
  // if(typeof floorHashValids[currentFloorHash] === 'boolean') {
  //   if(!floorHashValids[currentFloorHash]) {
  //     invalidStates++;
  //     return false;
  //   }
  // } else {
    if(!isCurrentStateValid(floorState)) {
      floorHashValids[currentFloorHash] = false;
      invalidStates++;
      if(lastUpdate.getTime() + 5000 < new Date().getTime()) {
        var hrsubend = process.hrtime(hrstart);
        console.log(invalidStates + ' invalidStates found, ' + Math.round(invalidStates/hrsubend[0]) + ' invalid states per second.', 'Running for: ' + hrsubend[0] + 's');
        lastUpdate = new Date();
      }
      // console.log('Invalid state:');
      // drawFloors(floorState, currentElevatorPos);
      return false;
    }
  //}
  var moveIsValid = false;
  if(!floorState[currentElevatorPos]) {
    console.log(currentElevatorPos);
  }
  var combinations = generateMoveCombinations(floorState[currentElevatorPos]);
  var newFloorState;
  var solutions = [];

  var minFloor = 1;
  if(floorState[1].length < 1) {
    minFloor = 2;
    if(floorState[2].length < 1) {
      minFloor = 3;
    }
  }

  _.forEach(combinations, function(combination) {
    if(currentElevatorPos < 4) {
      newFloorState = updateFloorState(floorState, currentElevatorPos, + 1, combination);
      if(beenThereDoneThat(solution, newFloorState)) { return; }
      var solutionRecUp = {
        e:currentElevatorPos + 1, direction: 'UP', elements: combination, state: newFloorState, hash: generateFloorHash(newFloorState)
      };
      //console.log(solution.length, currentElevatorPos, 'Moving up: ' + combination);
      var newSolutionUp = solution.concat(solutionRecUp);
      if(makeMove(newFloorState, currentElevatorPos + 1, newSolutionUp)) {
        solutions.push(newSolutionUp);
        moveIsValid = true;
      }
    }
  });
  _.forEach(combinations, function(combination) {
    if (currentElevatorPos > minFloor) {
      newFloorState = updateFloorState(floorState, currentElevatorPos, - 1, combination);
      if(beenThereDoneThat(solution, newFloorState)) { return; }
      var solutionRecDown = {
        e:currentElevatorPos - 1, direction: 'DOWN', elements: combination, state: newFloorState, hash: generateFloorHash(newFloorState)
      };
      //console.log(solution.length, currentElevatorPos, 'Moving down: ' + combination);
      var newSolution = solution.concat(solutionRecDown);
      if(makeMove(newFloorState, currentElevatorPos - 1, newSolution)) {
        solutions.push(newSolution);
        moveIsValid = true;
      }
    }
  });

  if(moveIsValid) {
    var shortest = _.min(solutions, 'length');
    console.log(shortest.length, _.map(solutions, 'length'))
    for(var i = solution.length; i < shortest.length; i++) {
      solution.push(shortest[i]);
    }
  }
  return moveIsValid;
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
