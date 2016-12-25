var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();

var commandRegex = /(cpy|jnz|dec|inc|tgl|out) ([-\w]*) ?([-\w]*)/i;

// input = [
//   'cpy 2 a', 'tgl a', 'tgl a', 'tgl a', 'cpy 1 a', 'dec a', 'dec a'
// ];

var registers = {
  a: 0,
  b: 0,
  c: 0,
  d: 0
};

function toggleCommand(toggleIndex) {
  if(input[toggleIndex]) {
    var before = input[toggleIndex];
    var match = commandRegex.exec(input[toggleIndex]);
    if(match[1]) {
      switch(match[1]) {
        case 'inc' : { input[toggleIndex] = 'dec ' + match[2]; } break;
        case 'tgl' : { input[toggleIndex] = 'inc ' + match[2]; } break;
        case 'dec' : { input[toggleIndex] = 'inc ' + match[2]; } break;
        case 'cpy' : { input[toggleIndex] = 'jnz ' + match[2] + ' ' + match[3]; } break;
        case 'jnz' : { input[toggleIndex] = 'cpy ' + match[2] + ' ' + match[3]; } break;
      }
    }
  }
}

function getValue(inputVal) {
  var value = parseInt(inputVal);
  if(isNaN(value)) {
    value = registers[inputVal];
  }
  return value;
}

var lastValue;
function send(value) {
  if(lastValue === undefined) {
    lastValue = value;
  } else if( (lastValue === 0 && value === 1) || (lastValue === 1 && value === 0)) {
    lastValue = value;
  } else {
    throw new Error('Not a bunny sequence!');
  }
}

function runCode(limit) {
  limit = limit || 150000;
  var commandIndex = 0;
  var counter = 0;
  while(input[commandIndex] && counter < limit) {
    counter++;
    var ci = commandIndex;
    var match = commandRegex.exec(input[commandIndex]);
    commandIndex++;
    if(match) {
      var value = getValue(match[2]);
      switch(match[1]) {
        case 'inc' : { registers[match[2]]++; } break;
        case 'dec' : { registers[match[2]]--; } break;
        case 'out' : { send(value); } break;
        case 'tgl' : { toggleCommand((commandIndex - 1) + value); } break;
        case 'cpy' : {
          if(registers[match[3]] !== undefined) {
            registers[match[3]] = value;
          }
        } break;
        case 'jnz' : {
          var jumpSize = getValue(match[3]);
          if(value !== 0 && jumpSize !== 0) {
            var newCommandIndex = (commandIndex - 1) + jumpSize;
            if(input[newCommandIndex]) {
              commandIndex = newCommandIndex;
            }
          }
        } break;
      }
    }
    //console.log(ci, input[ci], registers);
  }
}

var foundIt = false;
for(var a = 0; a < 500 && !foundIt; a++) {
  lastValue = undefined;
  registers = {
    a: a,
    b: 0,
    c: 0,
    d: 0
  };
  try {
    runCode();
    console.log('A = ' + a + ' is producing the sequence!');
    foundIt = true;
  } catch(exception) {
    console.error('A = ' + a + ' failed, ' + exception.message);
  }
}

//a = 6 = 8334
//a = 7 = 12654
//a = 8 = 47934

// low: 42
console.log(registers);
