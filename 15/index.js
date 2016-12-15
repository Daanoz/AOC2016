var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();
//
// input = [
//   'Disc #1 has 5 positions; at time=0, it is at position 4.',
//   'Disc #2 has 2 positions; at time=0, it is at position 1.'
// ];

if(true /* part 2 */) {
  input.push('Disc #7 has 11 positions; at time=0, it is at position 0')
}

var lineRegex = /Disc #(\d*) has (\d*) positions; at time=(\d*), it is at position (\d*)/;

function Disc(id, positions, currentPos) {
  this.id = id;
  this.positions = positions;
  this.currentPos = currentPos;
  this.offset = 0;

  this.tick = function() {
    this.currentPos++;

    this.realPos = (this.currentPos) % this.positions;
    this.offsetPos = (this.currentPos + this.offset) % this.positions;
  }
  this.setOffset = function(tickOffset) {
    this.offset = tickOffset;
  }
  this.done = function() {
    return (this.currentPos + this.offset) % this.positions === 0;
  }
  this.toString = function() {
    return "Disc #" + this.id + ' at postion: ' + this.currentPos + '/' + this.positions + '. When ball: ' + this.offsetPos;
  }
}
var discs = [];
_.forEach(input, function(line) {
  var match = lineRegex.exec(line);
  if(match) {
    discs.push(new Disc(match[1], parseInt(match[2]), parseInt(match[4])));
  }
});

_.forEach(discs, function(disc, index) {
  disc.setOffset(index+1);
});


var done = false;
var tick = 1;
while(!done) {
  //console.log('CURRENT TICK: ' + tick);
  _.forEach(discs, function(disc, index) {
    disc.tick();
    //console.log(disc.toString());
  });
  if(_.filter(discs, function(disc) { return disc.done(); }).length === discs.length) {
    done = true;
  } else {
    tick++;
  }
}

console.log('Final state:');
_.forEach(discs, function(disc, index) {
  console.log(disc.toString());
});

console.log(tick);
