
/* global VERSION */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _blogsDownload = require('./blogs/download');

var _blogsDownload2 = _interopRequireDefault(_blogsDownload);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var HELPTEXT = '\n\n    Quickshot blogs ' + VERSION + '\n    ==============================\n\n    Commands:\n      quickshot blogs upload [options]              Upload blogs files\n      quickshot blogs download [options]            Download blogs files\n      quickshot blogs                               Show this screen.\n\n    Options:\n      --target=[targetname]                         Explicitly select target for upload/download\n\n';

var run = function run(argv, done) {
  (0, _co2['default'])(function* () {
    var command = _lodash2['default'].first(argv['_']);
    argv['_'] = argv['_'].slice(1);

    if (command === 'download') {
      var result = yield (0, _blogsDownload2['default'])(argv);
    } else if (command === 'upload') {
      // var result = yield Upload(argv)
    } else {
        console.log(HELPTEXT);
      }

    console.log(_colors2['default'].green(result));
    done();
  })['catch'](done);
};

exports['default'] = run;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsb2dzLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztzQkFHbUIsUUFBUTs7OztzQkFDYixRQUFROzs7OzZCQUNELGtCQUFrQjs7OztrQkFDeEIsSUFBSTs7OztBQUVuQixJQUFJLFFBQVEsZ0NBRVUsT0FBTyx5WUFXNUIsQ0FBQTs7QUFFRCxJQUFJLEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBYSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQzlCLHVCQUFHLGFBQWE7QUFDZCxRQUFJLE9BQU8sR0FBRyxvQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDaEMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLFFBQUksT0FBTyxLQUFLLFVBQVUsRUFBRTtBQUMxQixVQUFJLE1BQU0sR0FBRyxNQUFNLGdDQUFTLElBQUksQ0FBQyxDQUFBO0tBQ2xDLE1BQU0sSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFOztLQUVoQyxNQUFNO0FBQ0wsZUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUN0Qjs7QUFFRCxXQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQ2pDLFFBQUksRUFBRSxDQUFBO0dBQ1AsQ0FBQyxTQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7Q0FDZixDQUFBOztxQkFFYyxHQUFHIiwiZmlsZSI6ImJsb2dzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuLyogZ2xvYmFsIFZFUlNJT04gKi9cblxuaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgRG93bmxvYWQgZnJvbSAnLi9ibG9ncy9kb3dubG9hZCdcbmltcG9ydCBjbyBmcm9tICdjbydcblxudmFyIEhFTFBURVhUID0gYFxuXG4gICAgUXVpY2tzaG90IGJsb2dzICR7VkVSU0lPTn1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIENvbW1hbmRzOlxuICAgICAgcXVpY2tzaG90IGJsb2dzIHVwbG9hZCBbb3B0aW9uc10gICAgICAgICAgICAgIFVwbG9hZCBibG9ncyBmaWxlc1xuICAgICAgcXVpY2tzaG90IGJsb2dzIGRvd25sb2FkIFtvcHRpb25zXSAgICAgICAgICAgIERvd25sb2FkIGJsb2dzIGZpbGVzXG4gICAgICBxdWlja3Nob3QgYmxvZ3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2hvdyB0aGlzIHNjcmVlbi5cblxuICAgIE9wdGlvbnM6XG4gICAgICAtLXRhcmdldD1bdGFyZ2V0bmFtZV0gICAgICAgICAgICAgICAgICAgICAgICAgRXhwbGljaXRseSBzZWxlY3QgdGFyZ2V0IGZvciB1cGxvYWQvZG93bmxvYWRcblxuYFxuXG52YXIgcnVuID0gZnVuY3Rpb24gKGFyZ3YsIGRvbmUpIHtcbiAgY28oZnVuY3Rpb24gKigpIHtcbiAgICB2YXIgY29tbWFuZCA9IF8uZmlyc3QoYXJndlsnXyddKVxuICAgIGFyZ3ZbJ18nXSA9IGFyZ3ZbJ18nXS5zbGljZSgxKVxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdkb3dubG9hZCcpIHtcbiAgICAgIHZhciByZXN1bHQgPSB5aWVsZCBEb3dubG9hZChhcmd2KVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ3VwbG9hZCcpIHtcbiAgICAgIC8vIHZhciByZXN1bHQgPSB5aWVsZCBVcGxvYWQoYXJndilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coSEVMUFRFWFQpXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coY29sb3JzLmdyZWVuKHJlc3VsdCkpXG4gICAgZG9uZSgpXG4gIH0pLmNhdGNoKGRvbmUpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1blxuIl19