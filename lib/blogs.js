
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

var _blogsUpload = require('./blogs/upload');

var _blogsUpload2 = _interopRequireDefault(_blogsUpload);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var HELPTEXT = '\n\n    Quickshot blogs ' + VERSION + '\n    ==============================\n\n    Commands:\n      quickshot blogs upload [options]              Upload blogs files\n      quickshot blogs download [options]            Download blogs files\n      quickshot blogs                               Show this screen.\n\n    Options:\n      --target=[targetname]                         Explicitly select target for upload/download\n\n';

var run = function run(argv, done) {
  (0, _co2['default'])(function* () {
    var command = _lodash2['default'].first(argv['_']);
    argv['_'] = argv['_'].slice(1);

    var result = null;

    if (command === 'download') {
      result = yield (0, _blogsDownload2['default'])(argv);
    } else if (command === 'upload') {
      result = yield (0, _blogsUpload2['default'])(argv);
    } else {
      console.log(HELPTEXT);
    }

    console.log(_colors2['default'].green(result));
    done();
  })['catch'](done);
};

exports['default'] = run;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsb2dzLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztzQkFHbUIsUUFBUTs7OztzQkFDYixRQUFROzs7OzZCQUNELGtCQUFrQjs7OzsyQkFDcEIsZ0JBQWdCOzs7O2tCQUNwQixJQUFJOzs7O0FBRW5CLElBQUksUUFBUSxnQ0FFVSxPQUFPLHlZQVc1QixDQUFBOztBQUVELElBQUksR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFhLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDOUIsdUJBQUcsYUFBYTtBQUNkLFFBQUksT0FBTyxHQUFHLG9CQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxRQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFOUIsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBOztBQUVqQixRQUFJLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDMUIsWUFBTSxHQUFHLE1BQU0sZ0NBQVMsSUFBSSxDQUFDLENBQUE7S0FDOUIsTUFBTSxJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7QUFDL0IsWUFBTSxHQUFHLE1BQU0sOEJBQU8sSUFBSSxDQUFDLENBQUE7S0FDNUIsTUFBTTtBQUNMLGFBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDdEI7O0FBRUQsV0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUNqQyxRQUFJLEVBQUUsQ0FBQTtHQUNQLENBQUMsU0FBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0NBQ2YsQ0FBQTs7cUJBRWMsR0FBRyIsImZpbGUiOiJibG9ncy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCBWRVJTSU9OICovXG5cbmltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IERvd25sb2FkIGZyb20gJy4vYmxvZ3MvZG93bmxvYWQnXG5pbXBvcnQgVXBsb2FkIGZyb20gJy4vYmxvZ3MvdXBsb2FkJ1xuaW1wb3J0IGNvIGZyb20gJ2NvJ1xuXG52YXIgSEVMUFRFWFQgPSBgXG5cbiAgICBRdWlja3Nob3QgYmxvZ3MgJHtWRVJTSU9OfVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgQ29tbWFuZHM6XG4gICAgICBxdWlja3Nob3QgYmxvZ3MgdXBsb2FkIFtvcHRpb25zXSAgICAgICAgICAgICAgVXBsb2FkIGJsb2dzIGZpbGVzXG4gICAgICBxdWlja3Nob3QgYmxvZ3MgZG93bmxvYWQgW29wdGlvbnNdICAgICAgICAgICAgRG93bmxvYWQgYmxvZ3MgZmlsZXNcbiAgICAgIHF1aWNrc2hvdCBibG9ncyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaG93IHRoaXMgc2NyZWVuLlxuXG4gICAgT3B0aW9uczpcbiAgICAgIC0tdGFyZ2V0PVt0YXJnZXRuYW1lXSAgICAgICAgICAgICAgICAgICAgICAgICBFeHBsaWNpdGx5IHNlbGVjdCB0YXJnZXQgZm9yIHVwbG9hZC9kb3dubG9hZFxuXG5gXG5cbnZhciBydW4gPSBmdW5jdGlvbiAoYXJndiwgZG9uZSkge1xuICBjbyhmdW5jdGlvbiAqKCkge1xuICAgIHZhciBjb21tYW5kID0gXy5maXJzdChhcmd2WydfJ10pXG4gICAgYXJndlsnXyddID0gYXJndlsnXyddLnNsaWNlKDEpXG5cbiAgICB2YXIgcmVzdWx0ID0gbnVsbFxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdkb3dubG9hZCcpIHtcbiAgICAgIHJlc3VsdCA9IHlpZWxkIERvd25sb2FkKGFyZ3YpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSAndXBsb2FkJykge1xuICAgICAgcmVzdWx0ID0geWllbGQgVXBsb2FkKGFyZ3YpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKEhFTFBURVhUKVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGNvbG9ycy5ncmVlbihyZXN1bHQpKVxuICAgIGRvbmUoKVxuICB9KS5jYXRjaChkb25lKVxufVxuXG5leHBvcnQgZGVmYXVsdCBydW5cbiJdfQ==