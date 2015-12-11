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

var _download = require('./theme/download');

var _download2 = _interopRequireDefault(_download);

var _upload = require('./theme/upload');

var _upload2 = _interopRequireDefault(_upload);

var _watch = require('./theme/watch');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRoZW1lLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLElBQUksUUFBUSxHQUFHLENBQUM7O29CQUVJLEdBQUUsT0FBTyxFQUFDOzs7Ozs7Ozs7Ozs7O0FBYTlCLENBQUMsQ0FBQTs7QUFFRCxJQUFJLEdBQUcsR0FBRyxXQUFXLElBQUksRUFBRTtBQUN6QixNQUFJLE9BQU8sR0FBRyxpQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDaEMsTUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQTs7QUFFakIsTUFBSSxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQzFCLFVBQU0sR0FBRyxNQUFNLHdCQUFTLElBQUksQ0FBQyxDQUFBO0dBQzlCLE1BQU0sSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQy9CLFVBQU0sR0FBRyxNQUFNLHNCQUFPLElBQUksQ0FBQyxDQUFBO0dBQzVCLE1BQU0sSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO0FBQzlCLFVBQU0sR0FBRyxNQUFNLHFCQUFNLElBQUksQ0FBQyxDQUFBO0dBQzNCLE1BQU07QUFDTCxXQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQ3RCOztBQUVELFNBQU8sTUFBTSxDQUFBO0NBQ2QsQ0FBQTs7a0JBRWMsR0FBRyIsImZpbGUiOiJ0aGVtZS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBjbyBmcm9tICdjbydcbmltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuXG5pbXBvcnQgRG93bmxvYWQgZnJvbSAnLi90aGVtZS9kb3dubG9hZCdcbmltcG9ydCBVcGxvYWQgZnJvbSAnLi90aGVtZS91cGxvYWQnXG5pbXBvcnQgV2F0Y2ggZnJvbSAnLi90aGVtZS93YXRjaCdcblxudmFyIEhFTFBURVhUID0gYFxuXG4gICAgUXVpY2tzaG90IHRoZW1lICR7VkVSU0lPTn1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIENvbW1hbmRzOlxuICAgICAgcXVpY2tzaG90IHRoZW1lIHVwbG9hZCBbb3B0aW9uc10gW2ZpbHRlcl0gICAgIFVwbG9hZCB0aGVtZSBmaWxlcywgb3B0aW9uYWxseSBwcm92aWRpbmcgYSBmaWx0ZXJcbiAgICAgIHF1aWNrc2hvdCB0aGVtZSBkb3dubG9hZCBbb3B0aW9uc10gW2ZpbHRlcl0gICBEb3dubG9hZCB0aGVtZSBmaWxlcywgb3B0aW9uYWxseSBwcm92aWRpbmcgYSBmaWx0ZXJcbiAgICAgIHF1aWNrc2hvdCB0aGVtZSB3YXRjaCBbb3B0aW9uc10gICAgICAgICAgICAgICBXYXRjaCB0aGVtZSBmb2xkZXIgYW5kIHN5bmNocm9uaXplIGNoYW5nZXMgYXV0b21hdGljYWxseVxuICAgICAgcXVpY2tzaG90IHRoZW1lICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNob3cgdGhpcyBzY3JlZW4uXG5cbiAgICBPcHRpb25zOlxuICAgICAgLS10YXJnZXQ9W3RhcmdldG5hbWVdICAgICAgICAgICAgICAgICAgICAgICAgIEV4cGxpY2l0bHkgc2VsZWN0IHRhcmdldCBmb3IgdXBsb2FkL2Rvd25sb2FkL3dhdGNoXG4gICAgICAtLXN5bmMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJhbnNmZXIgZmlsZXMgc3luY2hyb25vdXNseSBmb3IgdXBsb2FkL2Rvd25sb2FkXG5cbmBcblxudmFyIHJ1biA9IGZ1bmN0aW9uICooYXJndikge1xuICB2YXIgY29tbWFuZCA9IF8uZmlyc3QoYXJndlsnXyddKVxuICBhcmd2WydfJ10gPSBhcmd2WydfJ10uc2xpY2UoMSlcblxuICB2YXIgcmVzdWx0ID0gbnVsbFxuXG4gIGlmIChjb21tYW5kID09PSAnZG93bmxvYWQnKSB7XG4gICAgcmVzdWx0ID0geWllbGQgRG93bmxvYWQoYXJndilcbiAgfSBlbHNlIGlmIChjb21tYW5kID09PSAndXBsb2FkJykge1xuICAgIHJlc3VsdCA9IHlpZWxkIFVwbG9hZChhcmd2KVxuICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09ICd3YXRjaCcpIHtcbiAgICByZXN1bHQgPSB5aWVsZCBXYXRjaChhcmd2KVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKEhFTFBURVhUKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgZGVmYXVsdCBydW5cbiJdfQ==