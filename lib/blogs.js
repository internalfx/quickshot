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

var HELPTEXT = '\n\n    Quickshot blogs ' + VERSION + '\n    ==============================\n\n    Commands:\n      quickshot blogs upload [options] [filter]     Upload blogs files, optionally providing a filter\n      quickshot blogs download [options] [filter]   Download blogs files, optionally providing a filter\n      quickshot blogs                               Show this screen.\n\n\n    Options:\n      --target=[targetname]                         Explicitly select target for upload/download\n\n';

var run = function run(argv) {
  var command = _lodash2['default'].first(argv['_']);
  argv['_'] = argv['_'].slice(1);
  var funcTarget = null;
  if (command === 'download') {
    funcTarget = _blogsDownload2['default'];
  } else if (command === 'upload') {
    // funcTarget = Upload
  } else {
      console.log(HELPTEXT);
    }

  if (funcTarget != null) {
    funcTarget(argv).then(function (result) {
      console.log(_colors2['default'].green(result));
    })['catch'](function (err) {
      console.log(_colors2['default'].red(err));
    });
  }
};

exports['default'] = run;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsb2dzLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFDbUIsUUFBUTs7OztzQkFDYixRQUFROzs7OzZCQUNELGtCQUFrQjs7OztBQUV2QyxJQUFJLFFBQVEsZ0NBRVUsT0FBTyx5Y0FZNUIsQ0FBQTs7QUFFRCxJQUFJLEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBYSxJQUFJLEVBQUU7QUFDeEIsTUFBSSxPQUFPLEdBQUcsb0JBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLE1BQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQTtBQUNyQixNQUFJLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDMUIsY0FBVSw2QkFBVyxDQUFBO0dBQ3RCLE1BQU0sSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFOztHQUVoQyxNQUFNO0FBQ0wsYUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUN0Qjs7QUFFRCxNQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7QUFDdEIsY0FBVSxDQUFDLElBQUksQ0FBQyxDQUNmLElBQUksQ0FBQyxVQUFVLE1BQU0sRUFBRTtBQUN0QixhQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0tBQ2xDLENBQUMsU0FDSSxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ3BCLGFBQU8sQ0FBQyxHQUFHLENBQUMsb0JBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7S0FDN0IsQ0FBQyxDQUFBO0dBQ0g7Q0FDRixDQUFBOztxQkFFYyxHQUFHIiwiZmlsZSI6ImJsb2dzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgRG93bmxvYWQgZnJvbSAnLi9ibG9ncy9kb3dubG9hZCdcblxudmFyIEhFTFBURVhUID0gYFxuXG4gICAgUXVpY2tzaG90IGJsb2dzICR7VkVSU0lPTn1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIENvbW1hbmRzOlxuICAgICAgcXVpY2tzaG90IGJsb2dzIHVwbG9hZCBbb3B0aW9uc10gW2ZpbHRlcl0gICAgIFVwbG9hZCBibG9ncyBmaWxlcywgb3B0aW9uYWxseSBwcm92aWRpbmcgYSBmaWx0ZXJcbiAgICAgIHF1aWNrc2hvdCBibG9ncyBkb3dubG9hZCBbb3B0aW9uc10gW2ZpbHRlcl0gICBEb3dubG9hZCBibG9ncyBmaWxlcywgb3B0aW9uYWxseSBwcm92aWRpbmcgYSBmaWx0ZXJcbiAgICAgIHF1aWNrc2hvdCBibG9ncyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaG93IHRoaXMgc2NyZWVuLlxuXG5cbiAgICBPcHRpb25zOlxuICAgICAgLS10YXJnZXQ9W3RhcmdldG5hbWVdICAgICAgICAgICAgICAgICAgICAgICAgIEV4cGxpY2l0bHkgc2VsZWN0IHRhcmdldCBmb3IgdXBsb2FkL2Rvd25sb2FkXG5cbmBcblxudmFyIHJ1biA9IGZ1bmN0aW9uIChhcmd2KSB7XG4gIHZhciBjb21tYW5kID0gXy5maXJzdChhcmd2WydfJ10pXG4gIGFyZ3ZbJ18nXSA9IGFyZ3ZbJ18nXS5zbGljZSgxKVxuICB2YXIgZnVuY1RhcmdldCA9IG51bGxcbiAgaWYgKGNvbW1hbmQgPT09ICdkb3dubG9hZCcpIHtcbiAgICBmdW5jVGFyZ2V0ID0gRG93bmxvYWRcbiAgfSBlbHNlIGlmIChjb21tYW5kID09PSAndXBsb2FkJykge1xuICAgIC8vIGZ1bmNUYXJnZXQgPSBVcGxvYWRcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhIRUxQVEVYVClcbiAgfVxuXG4gIGlmIChmdW5jVGFyZ2V0ICE9IG51bGwpIHtcbiAgICBmdW5jVGFyZ2V0KGFyZ3YpXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coY29sb3JzLmdyZWVuKHJlc3VsdCkpXG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgY29uc29sZS5sb2coY29sb3JzLnJlZChlcnIpKVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVuXG4iXX0=