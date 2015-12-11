'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _download = require('./blogs/download');

var _download2 = _interopRequireDefault(_download);

var _upload = require('./blogs/upload');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HELPTEXT = `

    Quickshot blogs ${ VERSION }
    ==============================

    Commands:
      quickshot blogs upload [options]              Upload blogs files
      quickshot blogs download [options]            Download blogs files
      quickshot blogs                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`;
/* global VERSION */

var run = function (argv, done) {
  (0, _co2.default)(function* () {
    var command = _lodash2.default.first(argv['_']);
    argv['_'] = argv['_'].slice(1);

    var result = null;

    if (command === 'download') {
      result = yield (0, _download2.default)(argv);
    } else if (command === 'upload') {
      result = yield (0, _upload2.default)(argv);
    } else {
      console.log(HELPTEXT);
    }

    console.log(_colors2.default.green(result));
    done();
  }).catch(done);
};

exports.default = run;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsb2dzLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU0EsSUFBSSxRQUFRLEdBQUcsQ0FBQzs7b0JBRUksR0FBRSxPQUFPLEVBQUM7Ozs7Ozs7Ozs7O0FBVzlCLENBQUM7OztBQUFBLEFBRUQsSUFBSSxHQUFHLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQzlCLG9CQUFHLGFBQWE7QUFDZCxRQUFJLE9BQU8sR0FBRyxpQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDaEMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQTs7QUFFakIsUUFBSSxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQzFCLFlBQU0sR0FBRyxNQUFNLHdCQUFTLElBQUksQ0FBQyxDQUFBO0tBQzlCLE1BQU0sSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQy9CLFlBQU0sR0FBRyxNQUFNLHNCQUFPLElBQUksQ0FBQyxDQUFBO0tBQzVCLE1BQU07QUFDTCxhQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3RCOztBQUVELFdBQU8sQ0FBQyxHQUFHLENBQUMsaUJBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDakMsUUFBSSxFQUFFLENBQUE7R0FDUCxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0NBQ2YsQ0FBQTs7a0JBRWMsR0FBRyIsImZpbGUiOiJibG9ncy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCBWRVJTSU9OICovXG5cbmltcG9ydCBjbyBmcm9tICdjbydcbmltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IERvd25sb2FkIGZyb20gJy4vYmxvZ3MvZG93bmxvYWQnXG5pbXBvcnQgVXBsb2FkIGZyb20gJy4vYmxvZ3MvdXBsb2FkJ1xuXG52YXIgSEVMUFRFWFQgPSBgXG5cbiAgICBRdWlja3Nob3QgYmxvZ3MgJHtWRVJTSU9OfVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgQ29tbWFuZHM6XG4gICAgICBxdWlja3Nob3QgYmxvZ3MgdXBsb2FkIFtvcHRpb25zXSAgICAgICAgICAgICAgVXBsb2FkIGJsb2dzIGZpbGVzXG4gICAgICBxdWlja3Nob3QgYmxvZ3MgZG93bmxvYWQgW29wdGlvbnNdICAgICAgICAgICAgRG93bmxvYWQgYmxvZ3MgZmlsZXNcbiAgICAgIHF1aWNrc2hvdCBibG9ncyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaG93IHRoaXMgc2NyZWVuLlxuXG4gICAgT3B0aW9uczpcbiAgICAgIC0tdGFyZ2V0PVt0YXJnZXRuYW1lXSAgICAgICAgICAgICAgICAgICAgICAgICBFeHBsaWNpdGx5IHNlbGVjdCB0YXJnZXQgZm9yIHVwbG9hZC9kb3dubG9hZFxuXG5gXG5cbnZhciBydW4gPSBmdW5jdGlvbiAoYXJndiwgZG9uZSkge1xuICBjbyhmdW5jdGlvbiAqKCkge1xuICAgIHZhciBjb21tYW5kID0gXy5maXJzdChhcmd2WydfJ10pXG4gICAgYXJndlsnXyddID0gYXJndlsnXyddLnNsaWNlKDEpXG5cbiAgICB2YXIgcmVzdWx0ID0gbnVsbFxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdkb3dubG9hZCcpIHtcbiAgICAgIHJlc3VsdCA9IHlpZWxkIERvd25sb2FkKGFyZ3YpXG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSAndXBsb2FkJykge1xuICAgICAgcmVzdWx0ID0geWllbGQgVXBsb2FkKGFyZ3YpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKEhFTFBURVhUKVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGNvbG9ycy5ncmVlbihyZXN1bHQpKVxuICAgIGRvbmUoKVxuICB9KS5jYXRjaChkb25lKVxufVxuXG5leHBvcnQgZGVmYXVsdCBydW5cbiJdfQ==