var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();
input = input[0];

var parsingRegex = /^([\w ]*)\((\d*)x(\d*)\)/i;

var line = input;

if(false /* part1 */) {
  var newLineParts = [];
  while(line.length > 0) {
    var match = parsingRegex.exec(line);
    if(!match) {
      newLineParts.push(line);
      line = '';
    } else {
      newLineParts.push(match[1]);
      line = line.replace(parsingRegex, '');
      newLineParts.push(line.substr(0, parseInt(match[2])).repeat(parseInt(match[3])));
      line = line.substr(parseInt(match[2]));
    }
  }
  var newLine = newLineParts.join('');
  console.log(newLine);
  console.log('Size: ' + newLine.length);
} else {
  function getDecompressedLength(lineIn) {
    var newLineCount = 0;
    while(lineIn.length > 0) {
      var match = parsingRegex.exec(lineIn);
      if(!match) {
        newLineCount += lineIn.length;
        lineIn = '';
      } else {
        newLineCount += match[1].length;
        lineIn = lineIn.replace(parsingRegex, '');
        var repeatString = lineIn.substr(0, parseInt(match[2]));
        var repeatSizeDecompressed = getDecompressedLength(repeatString);
        newLineCount += repeatSizeDecompressed * parseInt(match[3]);
        lineIn = lineIn.substr(parseInt(match[2]));
      }
    }
    return newLineCount;
  }
  console.log('Size: ' + getDecompressedLength(line));
}
