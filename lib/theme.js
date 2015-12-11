'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _download = require('./theme/download');

var _download2 = _interopRequireDefault(_download);

var _upload = require('./theme/upload');

var _upload2 = _interopRequireDefault(_upload);

var _watch = require('./theme/watch');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global VERSION */

var HELPTEXT = `

    Quickshot theme ${ VERSION }
    ==============================

    Commands:
      quickshot theme upload [options] [filter]     Upload theme files, optionally providing a filter
      quickshot theme download [options] [filter]   Download theme files, optionally providing a filter
      quickshot theme watch [options]               Watch theme folder and synchronize changes automatically
      quickshot theme                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download/watch
      --sync                                        Transfer files synchronously for upload/download

`;

var run = function* (argv) {
  var command = _lodash2.default.first(argv['_']);
  argv['_'] = argv['_'].slice(1);

  var result = null;

  if (command === 'download') {
    result = yield (0, _download2.default)(argv);
  } else if (command === 'upload') {
    result = yield (0, _upload2.default)(argv);
  } else if (command === 'watch') {
    result = yield (0, _watch2.default)(argv);
  } else {
    console.log(HELPTEXT);
  }

  return result;
};

exports.default = run;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRoZW1lLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLElBQUksUUFBUSxHQUFHLENBQUM7O29CQUVJLEdBQUUsT0FBTyxFQUFDOzs7Ozs7Ozs7Ozs7O0FBYTlCLENBQUMsQ0FBQTs7QUFFRCxJQUFJLEdBQUcsR0FBRyxXQUFXLElBQUksRUFBRTtBQUN6QixNQUFJLE9BQU8sR0FBRyxpQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDaEMsTUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQTs7QUFFakIsTUFBSSxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQzFCLFVBQU0sR0FBRyxNQUFNLHdCQUFTLElBQUksQ0FBQyxDQUFBO0dBQzlCLE1BQU0sSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQy9CLFVBQU0sR0FBRyxNQUFNLHNCQUFPLElBQUksQ0FBQyxDQUFBO0dBQzVCLE1BQU0sSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO0FBQzlCLFVBQU0sR0FBRyxNQUFNLHFCQUFNLElBQUksQ0FBQyxDQUFBO0dBQzNCLE1BQU07QUFDTCxXQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQ3RCOztBQUVELFNBQU8sTUFBTSxDQUFBO0NBQ2QsQ0FBQTs7a0JBRWMsR0FBRyIsImZpbGUiOiJ0aGVtZS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuaW1wb3J0IERvd25sb2FkIGZyb20gJy4vdGhlbWUvZG93bmxvYWQnXG5pbXBvcnQgVXBsb2FkIGZyb20gJy4vdGhlbWUvdXBsb2FkJ1xuaW1wb3J0IFdhdGNoIGZyb20gJy4vdGhlbWUvd2F0Y2gnXG5cbi8qIGdsb2JhbCBWRVJTSU9OICovXG5cbnZhciBIRUxQVEVYVCA9IGBcblxuICAgIFF1aWNrc2hvdCB0aGVtZSAke1ZFUlNJT059XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBDb21tYW5kczpcbiAgICAgIHF1aWNrc2hvdCB0aGVtZSB1cGxvYWQgW29wdGlvbnNdIFtmaWx0ZXJdICAgICBVcGxvYWQgdGhlbWUgZmlsZXMsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgZmlsdGVyXG4gICAgICBxdWlja3Nob3QgdGhlbWUgZG93bmxvYWQgW29wdGlvbnNdIFtmaWx0ZXJdICAgRG93bmxvYWQgdGhlbWUgZmlsZXMsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgZmlsdGVyXG4gICAgICBxdWlja3Nob3QgdGhlbWUgd2F0Y2ggW29wdGlvbnNdICAgICAgICAgICAgICAgV2F0Y2ggdGhlbWUgZm9sZGVyIGFuZCBzeW5jaHJvbml6ZSBjaGFuZ2VzIGF1dG9tYXRpY2FsbHlcbiAgICAgIHF1aWNrc2hvdCB0aGVtZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaG93IHRoaXMgc2NyZWVuLlxuXG4gICAgT3B0aW9uczpcbiAgICAgIC0tdGFyZ2V0PVt0YXJnZXRuYW1lXSAgICAgICAgICAgICAgICAgICAgICAgICBFeHBsaWNpdGx5IHNlbGVjdCB0YXJnZXQgZm9yIHVwbG9hZC9kb3dubG9hZC93YXRjaFxuICAgICAgLS1zeW5jICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyYW5zZmVyIGZpbGVzIHN5bmNocm9ub3VzbHkgZm9yIHVwbG9hZC9kb3dubG9hZFxuXG5gXG5cbnZhciBydW4gPSBmdW5jdGlvbiAqKGFyZ3YpIHtcbiAgdmFyIGNvbW1hbmQgPSBfLmZpcnN0KGFyZ3ZbJ18nXSlcbiAgYXJndlsnXyddID0gYXJndlsnXyddLnNsaWNlKDEpXG5cbiAgdmFyIHJlc3VsdCA9IG51bGxcblxuICBpZiAoY29tbWFuZCA9PT0gJ2Rvd25sb2FkJykge1xuICAgIHJlc3VsdCA9IHlpZWxkIERvd25sb2FkKGFyZ3YpXG4gIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ3VwbG9hZCcpIHtcbiAgICByZXN1bHQgPSB5aWVsZCBVcGxvYWQoYXJndilcbiAgfSBlbHNlIGlmIChjb21tYW5kID09PSAnd2F0Y2gnKSB7XG4gICAgcmVzdWx0ID0geWllbGQgV2F0Y2goYXJndilcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhIRUxQVEVYVClcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVuXG4iXX0=