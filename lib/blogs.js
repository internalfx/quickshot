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

var HELPTEXT = '\n\n          Quickshot pages #{VERSION}\n          ==============================\n\n          Commands:\n            quickshot pages upload [options] [filter]     Upload pages files, optionally providing a filter\n            quickshot pages download [options] [filter]   Download pages files, optionally providing a filter\n            quickshot pages watch [options]               Watch pages folder and synchronize changes automatically\n            quickshot pages                               Show this screen.\n\n\n          Options:\n            --target=[targetname]                         Explicitly select target for upload/download/watch\n\n';

var run = function run(argv) {
  var command = _lodash2['default'].first(argv['_']);
  argv['_'] = argv['_'].slice(1);
  if (command === 'download') {
    (0, _blogsDownload2['default'])(argv);
  } else if (command === 'upload') {
    // require('./pages/upload').run(argv)
  } else {
      console.log(HELPTEXT);
    }

  // if (err != null) {
  //   console.log(colors.red(err))
  // }

  process.exit();
};

exports['default'] = run;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsb2dzLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFDbUIsUUFBUTs7OztzQkFDYixRQUFROzs7OzZCQUNELGtCQUFrQjs7OztBQUV2QyxJQUFJLFFBQVEscXBCQWVYLENBQUE7O0FBRUQsSUFBSSxHQUFHLEdBQUcsU0FBTixHQUFHLENBQWEsSUFBSSxFQUFFO0FBQ3hCLE1BQUksT0FBTyxHQUFHLG9CQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxNQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixNQUFJLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDMUIsb0NBQVMsSUFBSSxDQUFDLENBQUE7R0FDZixNQUFNLElBQUksT0FBTyxLQUFLLFFBQVEsRUFBRTs7R0FFaEMsTUFBTTtBQUNMLGFBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDdEI7Ozs7OztBQU1ELFNBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtDQUNmLENBQUE7O3FCQUVjLEdBQUciLCJmaWxlIjoiYmxvZ3MuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgY29sb3JzIGZyb20gJ2NvbG9ycydcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBEb3dubG9hZCBmcm9tICcuL2Jsb2dzL2Rvd25sb2FkJ1xuXG52YXIgSEVMUFRFWFQgPSBgXG5cbiAgICAgICAgICBRdWlja3Nob3QgcGFnZXMgI3tWRVJTSU9OfVxuICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgICAgQ29tbWFuZHM6XG4gICAgICAgICAgICBxdWlja3Nob3QgcGFnZXMgdXBsb2FkIFtvcHRpb25zXSBbZmlsdGVyXSAgICAgVXBsb2FkIHBhZ2VzIGZpbGVzLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIGZpbHRlclxuICAgICAgICAgICAgcXVpY2tzaG90IHBhZ2VzIGRvd25sb2FkIFtvcHRpb25zXSBbZmlsdGVyXSAgIERvd25sb2FkIHBhZ2VzIGZpbGVzLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIGZpbHRlclxuICAgICAgICAgICAgcXVpY2tzaG90IHBhZ2VzIHdhdGNoIFtvcHRpb25zXSAgICAgICAgICAgICAgIFdhdGNoIHBhZ2VzIGZvbGRlciBhbmQgc3luY2hyb25pemUgY2hhbmdlcyBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgICBxdWlja3Nob3QgcGFnZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2hvdyB0aGlzIHNjcmVlbi5cblxuXG4gICAgICAgICAgT3B0aW9uczpcbiAgICAgICAgICAgIC0tdGFyZ2V0PVt0YXJnZXRuYW1lXSAgICAgICAgICAgICAgICAgICAgICAgICBFeHBsaWNpdGx5IHNlbGVjdCB0YXJnZXQgZm9yIHVwbG9hZC9kb3dubG9hZC93YXRjaFxuXG5gXG5cbnZhciBydW4gPSBmdW5jdGlvbiAoYXJndikge1xuICB2YXIgY29tbWFuZCA9IF8uZmlyc3QoYXJndlsnXyddKVxuICBhcmd2WydfJ10gPSBhcmd2WydfJ10uc2xpY2UoMSlcbiAgaWYgKGNvbW1hbmQgPT09ICdkb3dubG9hZCcpIHtcbiAgICBEb3dubG9hZChhcmd2KVxuICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09ICd1cGxvYWQnKSB7XG4gICAgLy8gcmVxdWlyZSgnLi9wYWdlcy91cGxvYWQnKS5ydW4oYXJndilcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhIRUxQVEVYVClcbiAgfVxuXG4gIC8vIGlmIChlcnIgIT0gbnVsbCkge1xuICAvLyAgIGNvbnNvbGUubG9nKGNvbG9ycy5yZWQoZXJyKSlcbiAgLy8gfVxuXG4gIHByb2Nlc3MuZXhpdCgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1blxuIl19