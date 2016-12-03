var path = require('path');
var process = require('process');
var fs = require('fs');
var _ = require('./lodash.js');

function readInput(fileName) {
  return fs.readFileSync(path.join(process.cwd(), fileName || 'input'), {encoding: 'utf-8'});
}
function readNewLineSeperatedInput(fileName) {
  return _.map(readInput(fileName).split(/\r\n|\n|\r/), function(value) {
    return value.trim();
  });
}
function readCommaSeperatedInput(fileName) {
  return _.map(readInput(fileName).split(','), function(value) {
    return value.trim();
  });
}

module.exports = {
  readInput: readInput,
  readCommaSeperatedInput, readCommaSeperatedInput,
  readNewLineSeperatedInput: readNewLineSeperatedInput
};
