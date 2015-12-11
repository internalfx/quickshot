'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

/* global VERSION */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQSxJQUFJLFFBQVEsR0FBRyxDQUFDOztjQUVGLEdBQUUsT0FBTyxFQUFDOzs7Ozs7Ozs7OztBQVd4QixDQUFDLENBQUE7O0FBRUQsSUFBSSxHQUFHLEdBQUcsVUFBVSxJQUFJLEVBQUU7QUFDeEIsb0JBQUcsYUFBYTtBQUNkLFFBQUksT0FBTyxHQUFHLGlCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxRQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFOUIsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBOztBQUVqQixRQUFJLE9BQU8sS0FBSyxXQUFXLEVBQUU7QUFDM0IsWUFBTSxHQUFHLE1BQU0sb0JBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ25DLE1BQU0sSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO0FBQzlCLFlBQU0sR0FBRyxNQUFNLHFCQUFNLElBQUksQ0FBQyxDQUFBO0tBQzNCLE1BQU0sSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO0FBQzlCLFlBQU0sR0FBRyxNQUFNLGdCQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUMvQixNQUFNLElBQUksT0FBTyxLQUFLLFVBQVUsRUFBRTtBQUNqQyxZQUFNLEdBQUcsTUFBTSxtQkFBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEMsTUFBTSxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7QUFDOUIsWUFBTSxHQUFHLE1BQU0scUJBQU0sSUFBSSxDQUFDLENBQUE7S0FDM0IsTUFBTTtBQUNMLGFBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDdEI7O0FBRUQsUUFBSSxNQUFNLEVBQUU7QUFBRSxtQkE3Q1QsR0FBRyxFQTZDVSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FBRTtHQUNyQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ3RCLGlCQS9DSyxHQUFHLEVBK0NKLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7R0FDdEIsQ0FBQyxDQUFBO0NBQ0gsQ0FBQTs7a0JBRWMsR0FBRyIsImZpbGUiOiJtYWluLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGNvIGZyb20gJ2NvJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IENvbmZpZ3VyZSBmcm9tICcuL2NvbmZpZ3VyZSdcbmltcG9ydCBCbG9ncyBmcm9tICcuL2Jsb2dzJ1xuaW1wb3J0IFBhZ2VzIGZyb20gJy4vcGFnZXMnXG5pbXBvcnQgUHJvZHVjdHMgZnJvbSAnLi9wcm9kdWN0cydcbmltcG9ydCBUaGVtZSBmcm9tICcuL3RoZW1lJ1xuXG4vKiBnbG9iYWwgVkVSU0lPTiAqL1xuXG52YXIgSEVMUFRFWFQgPSBgXG5cbiAgICBRdWlja3Nob3QgJHtWRVJTSU9OfVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgQ29tbWFuZHM6XG4gICAgICBxdWlja3Nob3QgY29uZmlndXJlICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlcy9VcGRhdGVzIHRoZSBjb25maWd1cmF0aW9uIGZpbGUgaW4gY3VycmVudCBkaXJlY3RvcnlcbiAgICAgIHF1aWNrc2hvdCBibG9ncyAgICAgICAgICAgICAgICAgICAgICAgICBNYW5hZ2UgU2hvcGlmeSBibG9nc1xuICAgICAgcXVpY2tzaG90IHBhZ2VzICAgICAgICAgICAgICAgICAgICAgICAgIE1hbmFnZSBTaG9waWZ5IHBhZ2VzXG4gICAgICBxdWlja3Nob3QgcHJvZHVjdHMgICAgICAgICAgICAgICAgICAgICAgTWFuYWdlIFNob3BpZnkgcHJvZHVjdHNcbiAgICAgIHF1aWNrc2hvdCB0aGVtZSAgICAgICAgICAgICAgICAgICAgICAgICBNYW5hZ2UgU2hvcGlmeSB0aGVtZXNcbiAgICAgIHF1aWNrc2hvdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaG93IHRoaXMgc2NyZWVuLlxuXG5gXG5cbnZhciBydW4gPSBmdW5jdGlvbiAoYXJndikge1xuICBjbyhmdW5jdGlvbiAqKCkge1xuICAgIHZhciBjb21tYW5kID0gXy5maXJzdChhcmd2WydfJ10pXG4gICAgYXJndlsnXyddID0gYXJndlsnXyddLnNsaWNlKDEpXG5cbiAgICB2YXIgcmVzdWx0ID0gbnVsbFxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdjb25maWd1cmUnKSB7XG4gICAgICByZXN1bHQgPSB5aWVsZCBDb25maWd1cmUucnVuKGFyZ3YpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSAnYmxvZ3MnKSB7XG4gICAgICByZXN1bHQgPSB5aWVsZCBCbG9ncyhhcmd2KVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ3BhZ2VzJykge1xuICAgICAgcmVzdWx0ID0geWllbGQgUGFnZXMucnVuKGFyZ3YpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSAncHJvZHVjdHMnKSB7XG4gICAgICByZXN1bHQgPSB5aWVsZCBQcm9kdWN0cy5ydW4oYXJndilcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09ICd0aGVtZScpIHtcbiAgICAgIHJlc3VsdCA9IHlpZWxkIFRoZW1lKGFyZ3YpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKEhFTFBURVhUKVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQpIHsgbG9nKHJlc3VsdCwgJ2dyZWVuJykgfVxuICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgbG9nKGVyci5zdGFjaywgJ3JlZCcpXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1blxuIl19