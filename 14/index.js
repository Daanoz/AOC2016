var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');
var md5 = require('../05/md5.js');

var input = 'qzyelonm';
//var input = 'abc';

var tripleRegex = /(.)(\1{2,4})/;

var index = 0;


var hashList = [];
function createHash(index) {
  if(!hashList[index]) {
    var hash = md5(input + index);
    for(var i = 0; i < 2016; i++) {
      hash = md5(hash);
    }
    hashList[index] = hash;
  }
  return hashList[index];
}

var keyOverview = {};
var padKeys = [];
var foundIt = false;
while(!foundIt) {
  var hash = createHash(index);

  var match = tripleRegex.exec(hash);
  if(match) {
    var fiveRegex = new RegExp('(' + match[1] + ')\\1{4}');
    for(var subIndex = (index+1); subIndex <= (index+1000); subIndex++) {
      var subHash = createHash(subIndex);
      var subMatch = fiveRegex.exec(subHash);
      if(subMatch) {
        console.log("Found key " + match[1] + ' at position ' + index + '; verified at ' + subIndex);
        padKeys.push(index);
        subIndex = (index+1001);
      }
    }
  }
  if(padKeys.length >= 64) {
    foundIt = true;
  }
  index++;
}

console.log(index, padKeys, padKeys.length);
