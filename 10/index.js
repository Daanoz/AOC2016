var utils = require('../utils/utils.js');
var _ = require('../utils/lodash.js');

var input = utils.readNewLineSeperatedInput();

var botInstructionRegex = /bot (\d*) gives low to (\w*) (\d*) and high to (\w*) (\d*)/i;
var valueRegex = /value (\d*) goes to bot (\d*)/i;

var bots = {};
var outputs = {};

function Bot(botId, lowTarget, lowTargetId, highTarget, highTargetId) {
  var self = this;
  this.botId = botId;
  this.lowTarget = lowTarget;
  this.lowTargetId = lowTargetId;
  this.highTarget = highTarget;
  this.highTargetId = highTargetId;

  this.values = [];

  function setValueOnTarget(target, targetId, value) {
    if(target === 'output') {
      if(!outputs[targetId]) { outputs[targetId] = []; }
      outputs[targetId].push(value);
    } else {
      if(bots['bot ' + targetId]) {
        bots['bot ' + targetId].setValue(value);
      } else {
        console.warn('Unknown bot addressed: ' + targetId);
      }
    }
  }

  this.setValue = function(value) {
    self.values.push(value);
    if(self.values.length >= 2) {
      self.values.sort(function(a, b) { return a - b; });
      if(self.values[0] === 17 && this.values[1] === 61) {
        console.log('Bot ' + self.botId + ' processing 17 & 61');
      }
      setValueOnTarget(self.lowTarget, self.lowTargetId, self.values[0]);
      setValueOnTarget(self.highTarget, self.highTargetId, self.values[1]);
      self.values = [];
    }
  };
}

function addBotRule(botId, lowTarget, lowTargetId, highTarget, highTargetId) {
  if(!bots['bot ' + botId]) {
    bots['bot ' + botId] = new Bot(botId, lowTarget, lowTargetId, highTarget, highTargetId);
  } else {
    console.warn('Bot ' + botId + ' has multiple instructions!');
  }
}

var valueInput = [];
_.forEach(input, function(inputLine) {
  var match = botInstructionRegex.exec(inputLine);
  if(match) {
    addBotRule(match[1], match[2], match[3], match[4], match[5]);
  } else {
    var valueMatch = valueRegex.exec(inputLine);
    if(valueMatch) {
      valueInput.push({botId: valueMatch[2], value: parseInt(valueMatch[1])});
    }
  }
});

_.forEach(valueInput, function(valueInputItem) {
  if(bots['bot ' + valueInputItem.botId]) {
    bots['bot ' + valueInputItem.botId].setValue(valueInputItem.value);
  } else {
    console.warn('Unknown bot addressed: ' + targetId);
  }
});

console.log('Multiplied 0,1,2: ' + (outputs[0][0] * outputs[1][0] * outputs[2][0]));
