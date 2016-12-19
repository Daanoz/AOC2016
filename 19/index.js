var _ = require('../utils/lodash.js');

var input = 3017957;
//input = 20;
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
  var subhrstart = process.hrtime();
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
      //spliceOne(elves, otherElfIndex);
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
      var subhrend = process.hrtime(subhrstart);
      console.log(nextIndex, elves.length, '' + subhrend[0] + 's ' + subhrend[1]/1000000 + 'ms');
      previousLog = nextIndex;
      subhrstart = process.hrtime();
    }
  }
}


var hrend = process.hrtime(hrstart);
console.log('Result:', elves[0]);
console.log('It took: ' + hrend[0] + 's ' + hrend[1]/1000000 + 'ms');



// var elvesSize,forwardOffset,lastE,blackList,startPos = null;
// //while(elves.length > 1) {
//   // lets do the first half
//   elvesSize = elves.length;
//   forwardOffset = 0;
//   lastE = 0;
//   blackList = [];
//   for(var e = 0; e < Math.floor(elves.length / 2); e++) {
//     var otherSideE = Math.floor(e + (elvesSize / 2));
//     otherSideE += forwardOffset;
//
//     if(otherSideE < elves.length) {
//       blackList.push(otherSideE);
//       forwardOffset++;
//       elvesSize--;
//       lastE = e;
//     }
//   }
//   _.pullAt(elves, blackList);
//   // lets do the second half
//   elvesSize = elves.length;
//   forwardOffset = 0;
//   blackList = [];
//   startPos = (lastE + 1);
//   lastE = startPos;
//   for(var e = startPos; e < elves.length; e++) {
//     var otherSideE = Math.floor(e + (elvesSize / 2)) % elvesSize;
//     otherSideE += forwardOffset;
//     if(otherSideE < startPos) {
//       console.log((elves[e].id) + ' < ' + (elves[otherSideE].id) + '('+elves[otherSideE].presents+')');
//       blackList.push(otherSideE);
//       elvesSize--;
//       lastE = e;
//     }
//   }
//   _.pullAt(elves, blackList);
//   console.log(elves,lastE);
