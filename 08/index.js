var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();

// input = [
//   'rect 3x2',
//   'rotate column x=1 by 1',
//   'rotate row y=0 by 4',
//   'rotate column x=1 by 1'
// ];

var width  = 50;
var height = 6;
var screen = _.fill(new Array(height), null);
_.forEach(screen, function(line, y) {
  screen[y] = _.fill(new Array(width), ".");
});
var lineRegex = /(?:(rect) (\d*)x(\d*))|(?:(rotate) (row y|column x)=(\d*) by (\d*))/i;

printScreen();

_.forEach(input, function(line) {
  var match = lineRegex.exec(line);
  if(line.length > 0 && match) {
    switch (match[1] || match[4]) {
      case 'rect': transformRect(parseInt(match[2]), parseInt(match[3])); break;
      case 'rotate': transformRotate(match[5], parseInt(match[6]), parseInt(match[7])); break;
      default:
    }
    console.log('Processed: ' + line);
    printScreen();
  }
});

function transformRect(w, h) {
  for(var y = 0; y < h; y++) {
    for(var x = 0; x < w; x++) {
      screen[y][x] = '#';
    }
  }
}

function transformRotate(type, selection, offset) {
  if(type === "row y") {
    for(var o = 0; o < offset; o++) {
      screen[selection].unshift(screen[selection].pop());
    }
  } else if (type === "column x") {
    var column = _.map(screen, function(line) { return line[selection]; } );
    for(var o = 0; o < offset; o++) {
      column.unshift(column.pop());
    }
    _.forEach(column, function(value, key) {
      screen[key][selection] = value;
    });
  }
}

function printScreen() {
  var pixels = 0;
  _.forEach(screen, function(line) {
    console.log(line.join(''));
    pixels += _.filter(line, function(value) {return value === '#';}).length;
  });
  console.log(_.fill(new Array(width), "-").join(""));
  return pixels;
}

console.log('Pixels: ' + printScreen());
