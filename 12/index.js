var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();

var commandRegex = /(cpy|jnz|dec|inc) (\w*) ?([-\w]*)/i;

var registers = {
  a: 0,
  b: 0,
  c: 1,
  d: 0
};

var commandIndex = 0;
while(input[commandIndex]) {
  var match = commandRegex.exec(input[commandIndex]);
  commandIndex++;
  switch(match[1]) {
    case 'inc' : { registers[match[2]]++; } break;
    case 'dec' : { registers[match[2]]--; } break;
    case 'cpy' : {
      var value = parseInt(match[2]);
      if(isNaN(value)) {
          value = registers[match[2]];
      }
      registers[match[3]] = value;
    } break;
    case 'jnz' : {
      if(registers[match[2]] !== 0) {
        commandIndex = (commandIndex - 1) + parseInt(match[3]);
      }
    } break;
  }
}

console.log(registers);
