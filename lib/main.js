'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('./helpers');

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

var _blogs = require('./blogs');

var _blogs2 = _interopRequireDefault(_blogs);

var _pages = require('./pages');

var _pages2 = _interopRequireDefault(_pages);

var _products = require('./products');

var _products2 = _interopRequireDefault(_products);

var _theme = require('./theme');

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HELPTEXT = `

    Quickshot ${ VERSION }
    ==============================

    Commands:
      quickshot configure                     Creates/Updates the configuration file in current directory
      quickshot blogs                         Manage Shopify blogs
      quickshot pages                         Manage Shopify pages
      quickshot products                      Manage Shopify products
      quickshot theme                         Manage Shopify themes
      quickshot                               Show this screen.

`;

var run = function (argv) {
  (0, _co2.default)(function* () {
    var command = _lodash2.default.first(argv['_']);
    argv['_'] = argv['_'].slice(1);

    var result = null;

    if (command === 'configure') {
      result = yield _configure2.default.run(argv);
    } else if (command === 'blogs') {
      result = yield (0, _blogs2.default)(argv);
    } else if (command === 'pages') {
      result = yield _pages2.default.run(argv);
    } else if (command === 'products') {
      result = yield _products2.default.run(argv);
    } else if (command === 'theme') {
      result = yield (0, _theme2.default)(argv);
    } else {
      console.log(HELPTEXT);
    }

    if (result) {
      (0, _helpers.log)(result, 'green');
    }
  }).catch(function (err) {
    (0, _helpers.log)(err.stack, 'red');
  });
};

exports.default = run;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdBLElBQUksUUFBUSxHQUFHLENBQUM7O2NBRUYsR0FBRSxPQUFPLEVBQUM7Ozs7Ozs7Ozs7O0FBV3hCLENBQUMsQ0FBQTs7QUFFRCxJQUFJLEdBQUcsR0FBRyxVQUFVLElBQUksRUFBRTtBQUN4QixvQkFBRyxhQUFhO0FBQ2QsUUFBSSxPQUFPLEdBQUcsaUJBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUU5QixRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7O0FBRWpCLFFBQUksT0FBTyxLQUFLLFdBQVcsRUFBRTtBQUMzQixZQUFNLEdBQUcsTUFBTSxvQkFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbkMsTUFBTSxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7QUFDOUIsWUFBTSxHQUFHLE1BQU0scUJBQU0sSUFBSSxDQUFDLENBQUE7S0FDM0IsTUFBTSxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7QUFDOUIsWUFBTSxHQUFHLE1BQU0sZ0JBQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQy9CLE1BQU0sSUFBSSxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQ2pDLFlBQU0sR0FBRyxNQUFNLG1CQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNsQyxNQUFNLElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRTtBQUM5QixZQUFNLEdBQUcsTUFBTSxxQkFBTSxJQUFJLENBQUMsQ0FBQTtLQUMzQixNQUFNO0FBQ0wsYUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUN0Qjs7QUFFRCxRQUFJLE1BQU0sRUFBRTtBQUFFLG1CQTNDVCxHQUFHLEVBMkNVLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUFFO0dBQ3JDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUU7QUFDdEIsaUJBN0NLLEdBQUcsRUE2Q0osR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtHQUN0QixDQUFDLENBQUE7Q0FDSCxDQUFBOztrQkFFYyxHQUFHIiwiZmlsZSI6Im1haW4uZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgY29sb3JzIGZyb20gJ2NvbG9ycydcbmltcG9ydCBjbyBmcm9tICdjbydcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCBDb25maWd1cmUgZnJvbSAnLi9jb25maWd1cmUnXG5pbXBvcnQgQmxvZ3MgZnJvbSAnLi9ibG9ncydcbmltcG9ydCBQYWdlcyBmcm9tICcuL3BhZ2VzJ1xuaW1wb3J0IFByb2R1Y3RzIGZyb20gJy4vcHJvZHVjdHMnXG5pbXBvcnQgVGhlbWUgZnJvbSAnLi90aGVtZSdcblxudmFyIEhFTFBURVhUID0gYFxuXG4gICAgUXVpY2tzaG90ICR7VkVSU0lPTn1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIENvbW1hbmRzOlxuICAgICAgcXVpY2tzaG90IGNvbmZpZ3VyZSAgICAgICAgICAgICAgICAgICAgIENyZWF0ZXMvVXBkYXRlcyB0aGUgY29uZmlndXJhdGlvbiBmaWxlIGluIGN1cnJlbnQgZGlyZWN0b3J5XG4gICAgICBxdWlja3Nob3QgYmxvZ3MgICAgICAgICAgICAgICAgICAgICAgICAgTWFuYWdlIFNob3BpZnkgYmxvZ3NcbiAgICAgIHF1aWNrc2hvdCBwYWdlcyAgICAgICAgICAgICAgICAgICAgICAgICBNYW5hZ2UgU2hvcGlmeSBwYWdlc1xuICAgICAgcXVpY2tzaG90IHByb2R1Y3RzICAgICAgICAgICAgICAgICAgICAgIE1hbmFnZSBTaG9waWZ5IHByb2R1Y3RzXG4gICAgICBxdWlja3Nob3QgdGhlbWUgICAgICAgICAgICAgICAgICAgICAgICAgTWFuYWdlIFNob3BpZnkgdGhlbWVzXG4gICAgICBxdWlja3Nob3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2hvdyB0aGlzIHNjcmVlbi5cblxuYFxuXG52YXIgcnVuID0gZnVuY3Rpb24gKGFyZ3YpIHtcbiAgY28oZnVuY3Rpb24gKigpIHtcbiAgICB2YXIgY29tbWFuZCA9IF8uZmlyc3QoYXJndlsnXyddKVxuICAgIGFyZ3ZbJ18nXSA9IGFyZ3ZbJ18nXS5zbGljZSgxKVxuXG4gICAgdmFyIHJlc3VsdCA9IG51bGxcblxuICAgIGlmIChjb21tYW5kID09PSAnY29uZmlndXJlJykge1xuICAgICAgcmVzdWx0ID0geWllbGQgQ29uZmlndXJlLnJ1bihhcmd2KVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ2Jsb2dzJykge1xuICAgICAgcmVzdWx0ID0geWllbGQgQmxvZ3MoYXJndilcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09ICdwYWdlcycpIHtcbiAgICAgIHJlc3VsdCA9IHlpZWxkIFBhZ2VzLnJ1bihhcmd2KVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ3Byb2R1Y3RzJykge1xuICAgICAgcmVzdWx0ID0geWllbGQgUHJvZHVjdHMucnVuKGFyZ3YpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSAndGhlbWUnKSB7XG4gICAgICByZXN1bHQgPSB5aWVsZCBUaGVtZShhcmd2KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhIRUxQVEVYVClcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0KSB7IGxvZyhyZXN1bHQsICdncmVlbicpIH1cbiAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGxvZyhlcnIuc3RhY2ssICdyZWQnKVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBydW5cbiJdfQ==