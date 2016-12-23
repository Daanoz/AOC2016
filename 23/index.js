var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();

var commandRegex = /(cpy|jnz|dec|inc|tgl) ([-\w]*) ?([-\w]*)/i;

// input = [
//   'cpy 2 a', 'tgl a', 'tgl a', 'tgl a', 'cpy 1 a', 'dec a', 'dec a'
// ];

var registers = {
  a: 12,
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
    console.log(before, ' -> ', input[toggleIndex]);
  }
}

function getValue(inputVal) {
  var value = parseInt(inputVal);
  if(isNaN(value)) {
    value = registers[inputVal];
  }
  return value;
}

var commandIndex = 0;
while(input[commandIndex]) {
  var ci = commandIndex;
  var match = commandRegex.exec(input[commandIndex]);
  commandIndex++;
  if(match) {
    var value = getValue(match[2]);
    switch(match[1]) {
      case 'inc' : { registers[match[2]]++; } break;
      case 'dec' : { registers[match[2]]--; } break;
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

//a = 6 = 8334
//a = 7 = 12654
//a = 8 = 47934

// low: 42
console.log(registers);
