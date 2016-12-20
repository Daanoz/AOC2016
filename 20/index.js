var _ = require('../utils/lodash.js');
var utils = require('../utils/utils.js');

var input = utils.readNewLineSeperatedInput();

input = _.compact(_.map(input, function(value) {
  if(value === '') { return null; }
  var vals = value.split('-');
  return {
    start: parseInt(vals[0]),
    end:   parseInt(vals[1]),
  };
}));

function sortList(a, b) {
  return a.start - b.start;
}

input = input.sort(sortList);



function findRangeItem(condensedBlackList, value) {
  return _.find(condensedBlackList, function(item) {
    return item.start <= value && (item.end + 1) >= value;
  });
}
function findAllRangeItem(condensedBlackList, value) {
  return _.filter(condensedBlackList, function(item) {
    return item.start <= value || item.end >= value;
  });
}

function condenseInput(blacklist) {
  var condensedBlackList = [];
  _.forEach(blacklist, function(value) {
    var startRange = findRangeItem(condensedBlackList, value.start);
    var endRange = findRangeItem(condensedBlackList, value.end);
    if(startRange && !endRange) {
      startRange.end = value.end;
    } else if(!startRange && endRange) {
      startRange.start = value.start;
    } else if(!startRange && !endRange) {
      condensedBlackList.push(_.cloneDeep(value));
    } else if(startRange && endRange) {
      if(startRange !== endRange) {
        // appearently this does not happen...
        console.log('We need to merge:', startRange, endRange);
      }
    }
  });
  condensedBlackList.sort(sortList);
  return condensedBlackList;
}

var condensedInput = condenseInput(input);
var totalAllowed = 0;
var lastValue = 0;
var lowestValue = null;
_.forEach(condensedInput, function(value) {
  if(value.start > (lastValue + 1)) {
    if(lowestValue === null) {
      lowestValue = (lastValue + 1);
    }
    totalAllowed += value.start - (lastValue + 1);
  }
  lastValue = value.end;
});

console.log(lowestValue + ' is lowest next');
console.log(totalAllowed + ' total allowed');
