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

    (0, _helpers.log)(result, 'green');
  }).catch(function (err) {
    (0, _helpers.log)(err, 'red');
  });
};

exports.default = run;

// var run = function (argv) {
//   command = _.first(argv['_'])
//   argv['_'] = argv['_'].slice(1)
//   switch command
//     when "configure"
//       await require('./configure').run(argv, defer(err))
//     when "blogs"
//       await require('./blogs')(argv, defer(err))
//     when "pages"
//       await require('./pages').run(argv, defer(err))
//     when "products"
//       await require('./products').run(argv, defer(err))
//     when "theme"
//       await require('./theme').run(argv, defer(err))
//     else
//       console.log HELPTEXT
//
//   if err?
//     console.log colors.red(err)
//
//   process.exit()
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdBLElBQUksUUFBUSxHQUFHLENBQUM7O2NBRUYsR0FBRSxPQUFPLEVBQUM7Ozs7Ozs7Ozs7O0FBV3hCLENBQUMsQ0FBQTs7QUFFRCxJQUFJLEdBQUcsR0FBRyxVQUFVLElBQUksRUFBRTtBQUN4QixvQkFBRyxhQUFhO0FBQ2QsUUFBSSxPQUFPLEdBQUcsaUJBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUU5QixRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7O0FBRWpCLFFBQUksT0FBTyxLQUFLLFdBQVcsRUFBRTtBQUMzQixZQUFNLEdBQUcsTUFBTSxvQkFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbkMsTUFBTSxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7QUFDOUIsWUFBTSxHQUFHLE1BQU0scUJBQU0sSUFBSSxDQUFDLENBQUE7S0FDM0IsTUFBTSxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7QUFDOUIsWUFBTSxHQUFHLE1BQU0sZ0JBQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQy9CLE1BQU0sSUFBSSxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQ2pDLFlBQU0sR0FBRyxNQUFNLG1CQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNsQyxNQUFNLElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRTtBQUM5QixZQUFNLEdBQUcsTUFBTSxxQkFBTSxJQUFJLENBQUMsQ0FBQTtLQUMzQixNQUFNO0FBQ0wsYUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUN0Qjs7QUFFRCxpQkEzQ0ssR0FBRyxFQTJDSixNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDckIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUN0QixpQkE3Q0ssR0FBRyxFQTZDSixHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUE7R0FDaEIsQ0FBQyxDQUFBO0NBQ0gsQ0FBQTs7a0JBRWMsR0FBRyIsImZpbGUiOiJtYWluLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnXG5pbXBvcnQgY28gZnJvbSAnY28nXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgQ29uZmlndXJlIGZyb20gJy4vY29uZmlndXJlJ1xuaW1wb3J0IEJsb2dzIGZyb20gJy4vYmxvZ3MnXG5pbXBvcnQgUGFnZXMgZnJvbSAnLi9wYWdlcydcbmltcG9ydCBQcm9kdWN0cyBmcm9tICcuL3Byb2R1Y3RzJ1xuaW1wb3J0IFRoZW1lIGZyb20gJy4vdGhlbWUnXG5cbnZhciBIRUxQVEVYVCA9IGBcblxuICAgIFF1aWNrc2hvdCAke1ZFUlNJT059XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBDb21tYW5kczpcbiAgICAgIHF1aWNrc2hvdCBjb25maWd1cmUgICAgICAgICAgICAgICAgICAgICBDcmVhdGVzL1VwZGF0ZXMgdGhlIGNvbmZpZ3VyYXRpb24gZmlsZSBpbiBjdXJyZW50IGRpcmVjdG9yeVxuICAgICAgcXVpY2tzaG90IGJsb2dzICAgICAgICAgICAgICAgICAgICAgICAgIE1hbmFnZSBTaG9waWZ5IGJsb2dzXG4gICAgICBxdWlja3Nob3QgcGFnZXMgICAgICAgICAgICAgICAgICAgICAgICAgTWFuYWdlIFNob3BpZnkgcGFnZXNcbiAgICAgIHF1aWNrc2hvdCBwcm9kdWN0cyAgICAgICAgICAgICAgICAgICAgICBNYW5hZ2UgU2hvcGlmeSBwcm9kdWN0c1xuICAgICAgcXVpY2tzaG90IHRoZW1lICAgICAgICAgICAgICAgICAgICAgICAgIE1hbmFnZSBTaG9waWZ5IHRoZW1lc1xuICAgICAgcXVpY2tzaG90ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNob3cgdGhpcyBzY3JlZW4uXG5cbmBcblxudmFyIHJ1biA9IGZ1bmN0aW9uIChhcmd2KSB7XG4gIGNvKGZ1bmN0aW9uICooKSB7XG4gICAgdmFyIGNvbW1hbmQgPSBfLmZpcnN0KGFyZ3ZbJ18nXSlcbiAgICBhcmd2WydfJ10gPSBhcmd2WydfJ10uc2xpY2UoMSlcblxuICAgIHZhciByZXN1bHQgPSBudWxsXG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2NvbmZpZ3VyZScpIHtcbiAgICAgIHJlc3VsdCA9IHlpZWxkIENvbmZpZ3VyZS5ydW4oYXJndilcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09ICdibG9ncycpIHtcbiAgICAgIHJlc3VsdCA9IHlpZWxkIEJsb2dzKGFyZ3YpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSAncGFnZXMnKSB7XG4gICAgICByZXN1bHQgPSB5aWVsZCBQYWdlcy5ydW4oYXJndilcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09ICdwcm9kdWN0cycpIHtcbiAgICAgIHJlc3VsdCA9IHlpZWxkIFByb2R1Y3RzLnJ1bihhcmd2KVxuICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ3RoZW1lJykge1xuICAgICAgcmVzdWx0ID0geWllbGQgVGhlbWUoYXJndilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coSEVMUFRFWFQpXG4gICAgfVxuXG4gICAgbG9nKHJlc3VsdCwgJ2dyZWVuJylcbiAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGxvZyhlcnIsICdyZWQnKVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBydW5cblxuLy8gdmFyIHJ1biA9IGZ1bmN0aW9uIChhcmd2KSB7XG4vLyAgIGNvbW1hbmQgPSBfLmZpcnN0KGFyZ3ZbJ18nXSlcbi8vICAgYXJndlsnXyddID0gYXJndlsnXyddLnNsaWNlKDEpXG4vLyAgIHN3aXRjaCBjb21tYW5kXG4vLyAgICAgd2hlbiBcImNvbmZpZ3VyZVwiXG4vLyAgICAgICBhd2FpdCByZXF1aXJlKCcuL2NvbmZpZ3VyZScpLnJ1bihhcmd2LCBkZWZlcihlcnIpKVxuLy8gICAgIHdoZW4gXCJibG9nc1wiXG4vLyAgICAgICBhd2FpdCByZXF1aXJlKCcuL2Jsb2dzJykoYXJndiwgZGVmZXIoZXJyKSlcbi8vICAgICB3aGVuIFwicGFnZXNcIlxuLy8gICAgICAgYXdhaXQgcmVxdWlyZSgnLi9wYWdlcycpLnJ1bihhcmd2LCBkZWZlcihlcnIpKVxuLy8gICAgIHdoZW4gXCJwcm9kdWN0c1wiXG4vLyAgICAgICBhd2FpdCByZXF1aXJlKCcuL3Byb2R1Y3RzJykucnVuKGFyZ3YsIGRlZmVyKGVycikpXG4vLyAgICAgd2hlbiBcInRoZW1lXCJcbi8vICAgICAgIGF3YWl0IHJlcXVpcmUoJy4vdGhlbWUnKS5ydW4oYXJndiwgZGVmZXIoZXJyKSlcbi8vICAgICBlbHNlXG4vLyAgICAgICBjb25zb2xlLmxvZyBIRUxQVEVYVFxuLy9cbi8vICAgaWYgZXJyP1xuLy8gICAgIGNvbnNvbGUubG9nIGNvbG9ycy5yZWQoZXJyKVxuLy9cbi8vICAgcHJvY2Vzcy5leGl0KClcbiJdfQ==