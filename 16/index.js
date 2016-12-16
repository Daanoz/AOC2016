var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

input = '10011111011011001';
//targetLength = 272;
targetLength = 35651584;
// input = '10000';
// targetLength = 20;

var data = input;

var ready = false;
while(!ready) {
  var a = data;
  var b = a.split("").reverse().join("");
  b = b.replace(/0/g,'X').replace(/1/g,'0').replace(/X/g,'1');
  data = a + '0' + b;
  if(data.length >= targetLength) {
    ready = true;
    data = data.substr(0, targetLength);
  }
}

// checksum
var checkSum = '';
var checkSumInput = data;
while(checkSum === '' || (checkSum.length % 2) !== 1) {
  checkSum = '';
  var checkMatch = null;
  var pairRegex = /(.{2})/g;
  while (checkMatch = pairRegex.exec(checkSumInput)) {
    checkSum += checkMatch[1][0] === checkMatch[1][1] ? '1' : '0';
  }
  checkSumInput = checkSum;
}

console.log('CheckSum: ' + checkSum);
