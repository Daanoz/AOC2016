var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();
var lineMatch = /([a-z]+)\[?([a-z]*)\]?/gi;
var appaRegex = /(.)(.)\2\1/ig;

function detectAbba(value) {
  var match = appaRegex.exec(value);
  if(match && (match[1] !== match[2])) {
    return true;
  }
  return false;
}

function hasAbba(line) {
  var match = null;
  var outsideMatches = [];
  var insideMatches = [];
  while (match = lineMatch.exec(line)) {
    if(match[1]) { outsideMatches.push(match[1]); }
    if(match[2]) { insideMatches.push(match[2]);  }
  }
  return (_.filter(insideMatches, detectAbba).length < 1 &&
          _.filter(outsideMatches, detectAbba).length >= 1);
}

var abaRegex1 = /(.)(.)\1[a-z]*(?:\[[a-z]*\][a-z]*)*\[[a-z]*\2\1\2[a-z]*\]/gi;
var abaRegex2 = /\[[a-z]*(.)(.)\1[a-z]*\](?:[a-z]*\[[a-z]*\])*[a-z]*\2\1\2/gi;
function hasAba(line) {
  var abaRegex = /(?:(\w)(\w)\1\w*(?:\[\w*\]\w*)*\[\w*(\2\1\2)\w*\])|(?:\[\w*(\w)(\w)\4\w*\](?:\w*\[\w*\])*\w*(\5\4\5))/gi;
  var match = abaRegex.exec(line);
  if(match) {
    if(match[1] && match[1] !== match[2]) {
      return true;
    } else if (match[4] && match[4] !== match[5]) {
      return true;
    }
  }
  return false;
}

var abbaCount = 0;
var abaCount = 0;
_.forEach(input, function(line) {
  if(line.length > 0) {
    if(hasAbba(line)) {
      abbaCount++;
    }
    if(hasAba(line)) {
      abaCount++;
    }
  }
});

console.log('Number of IP\'s supporting TLS: ' + abbaCount);

// to low: 141
// to high: 261
// to low 234
console.log('Number of IP\'s supporting SSL: ' + abaCount);
