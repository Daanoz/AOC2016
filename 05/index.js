var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');
var md5 = require('./md5.js');

var input = utils.readNewLineSeperatedInput();
var doorId = input[0];

var bAdvanced = true;

var index = 0;
var result = _.fill(Array(8), '_');
while(_.indexOf(result, '_') >= 0) {
  var foundIt = false;
  while(!foundIt) {
    var hash = md5(doorId + index);
    index++;
    if(hash.substr(0, 5) === '00000') {
      if(bAdvanced) {
        var pos = parseInt(hash.substr(5, 1));
        if(result[pos] && result[pos] === '_') {
          result[pos] = hash.substr(6, 1);
          foundIt = true;
        }
      } else {
        result[_.indexOf(result, '_')] = hash.substr(5, 1);
        foundIt = true;
      }
    }
  }
  console.log('Found new hash @ ' + index + ', result = ' + result.join(''));
}

console.log('Password: ' + result.join(''));
