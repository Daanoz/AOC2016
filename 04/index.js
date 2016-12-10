var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();
var roomRegex = /^^([a-z0-9\-]*)-([0-9]*)\[([a-z0-9]*)\]$/i;

function countLetters(input) {
  var result = {};
  for(var i = 0; i < input.length; i++) {
    var char = input[i];
    if(char !== '-') {
      result[char] = result[char] ? result[char]+1 : 1;
    }
  }
  return result;
}

function getTop5Letters(input) {
  var letterCount = _.map(countLetters(input), function(value, key) {
    return {char: key, count: value};
  });
  letterCount.sort(function (a, b) {
    if (a.count > b.count) { return -1;  }
    if (a.count < b.count) { return 1; }
    if (a.char.charCodeAt(0) > b.char.charCodeAt(0)) { return 1; }
    if (a.char.charCodeAt(0) < b.char.charCodeAt(0)) { return -1;}
    console.error('Error while sorting, detected as same:', a, b);
    return 0;
  });
  return _.map(letterCount.slice(0, 5), 'char');
}

function validateChecksum(validLetters, checkSum) {
  for(var i = 0; i < checkSum.length; i++) {
    if(_.indexOf(validLetters, checkSum[i]) < 0) {
      return false;
    }
  }
  return true;
}

var outcome = 0;
var validRooms = [];
_.forEach(input, function(inputLine) {
  var result = roomRegex.exec(inputLine);
  if(result) {
    var validLetters = getTop5Letters(result[1]);
    if(validateChecksum(validLetters, result[3])) {
      outcome += parseInt(result[2]);
      console.log('Valid:' + result[0]);
      validRooms.push({roomNameEcrypted: result[1], sectorId: parseInt(result[2])});
    } else {
      console.log('Invalid:' + result[0]);
    }
  }
});

console.log('Sum of sectors: ' + outcome);

var charCodeA = 97;
_.forEach(validRooms, function(room) {
  var roomName = '';
  var encrypted = room.roomNameEcrypted;
  for(var i = 0; i < encrypted.length; i++) {
    if(encrypted[i] === '-') {
      roomName += ' ';
    } else {
      var charOffset = encrypted.charCodeAt(i) - charCodeA;
      roomName += String.fromCharCode(charCodeA + ((charOffset + room.sectorId) % 26));
    }
  }
  if(roomName === 'northpole object storage') {
    console.log('North pole object storage @ ' + room.sectorId);
  }
});
