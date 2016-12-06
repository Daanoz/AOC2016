var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();

var sums = {};
_.forEach(input, function(line) {
  if(line.length > 0) {
    var chars = line.split('');
    _.forEach(chars, function(char, index) {
      if(!sums[index]) { sums[index] = {}; }
      if(!sums[index][char]) { sums[index][char] = {char: char, c: 0}; }
      sums[index][char].c++;
    });
  }
});
var resultA = '';
var resultB = '';
_.forEach(sums, function(charCounts, index) {
  var maxChar = _.maxBy(_.values(charCounts), 'c');
  resultA += maxChar.char;
  var minChar = _.minBy(_.values(charCounts), 'c');
  resultB += minChar.char;
});

console.log('Message A: ' + resultA);
console.log('Message B: ' + resultB);
