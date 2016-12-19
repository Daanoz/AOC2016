var _ = require('../utils/lodash.js');

var input = 3017957;
//input = 5;
var part2 = true;

var elves = [];
for(var i = 0; i < input; i++) {
  elves.push({
    id: i + 1,
    presents: 1
  });
}
console.log('Starting with: ' + elves.length);

var hrstart = process.hrtime();
if(!part2) {
  while(elves.length > 1) {
    var elves = _.filter(elves, function(elf, e) {
      if(elf.presents > 0) {
        for(e2 = 1; e2 <= elves.length; e2++) {
          var eIndex = (e + e2) % elves.length;
          var otherElf = elves[eIndex];
          if(otherElf.presents && (eIndex !== e)) {
            //console.log((e+1) + ' < ' + (eIndex+1) + '('+elves[eIndex].presents+')');
            elf.presents += otherElf.presents;
            otherElf.presents = 0;
            e2 = elves.length + 1;
          }
        }
        return true;
      } else {
        return false;
      }
    });
    console.log(elves.length + ' remaining');
  }
} else {
  var nextIndex = 0;
  var previousLog = 0;
  while(elves.length > 1) {
    var divider = Math.floor(elves.length / 2);
    var elf      = elves[nextIndex];
    var otherElfIndex = (nextIndex + divider) % elves.length;
    var otherElf = elves[otherElfIndex];
    if(elf !== otherElf) {
      //console.log((elf.id) + ' < ' + (otherElf.id) + '('+otherElf.presents+')');
      elf.presents += otherElf.presents;
      elves.splice(otherElfIndex, 1);
      if(otherElfIndex > nextIndex) {
        nextIndex++;
      }
      if(nextIndex >= elves.length) {
        nextIndex = 0;
        previousLog = 0;
        console.log(elves.length);
      }
    }
    if((nextIndex - previousLog) > 1000) {
      console.log(nextIndex, elves.length);
      previousLog = nextIndex;
    }
  }
}


var hrend = process.hrtime(hrstart);
console.log(elves[0]);
console.log('It took: ' + hrend[0] + 's ' + hrend[1]/1000000 + 'ms');
