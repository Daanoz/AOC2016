var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var rawInput = utils.readNewLineSeperatedInput();
var input = _.map(rawInput, function(inputLine) {
  return _.map(inputLine.split(/ +/), function(inputValue) {
    return parseInt(inputValue.trim());
  });
});

if(true) { // day2
  var convertedInput = [];
  for(var i = 0; i <= input.length; i += 3) {
    if(!input[i+2]) { break; }
    convertedInput.push([input[i][0], input[i+1][0], input[i+2][0]]);
    convertedInput.push([input[i][1], input[i+1][1], input[i+2][1]]);
    convertedInput.push([input[i][2], input[i+1][2], input[i+2][2]]);
  }
  input = convertedInput;
  console.log(input);
}

var validTriangles = 0;
_.forEach(input, function(triangleVars) {
  if(triangleVars.length === 3) {
    triangleVars = _.sortBy(triangleVars);
    if(triangleVars[0] + triangleVars[1] > triangleVars[2]) {
      validTriangles++;
    }
  }
});

console.log('Valid triangles:' + validTriangles);
