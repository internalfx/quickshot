'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listFiles = exports.log = exports.ts = exports.getShopPages = exports.getTarget = exports.shopifyRequest = exports.loadConfig = exports.delay = exports.question = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _machinepackFs = require('machinepack-fs');

var _machinepackFs2 = _interopRequireDefault(_machinepackFs);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _dive = require('dive');

var _dive2 = _interopRequireDefault(_dive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import fs from 'fs'

_bluebird2.default.promisifyAll(_inquirer2.default);

/* global CONFIGVERSION */

var question = exports.question = function (questions) {
  var deferred = _bluebird2.default.pending();
  _inquirer2.default.prompt(questions, function (answers) {
    deferred.resolve(answers);
  });
  return deferred.promise;
};

var delay = exports.delay = function (ms) {
  var deferred = _bluebird2.default.pending();
  setTimeout(function () {
    deferred.resolve();
  }, ms);
  return deferred.promise;
};

var shopify = {
  isRunning: false,
  throttle: 0,
  inFlight: 0,
  rate: 0,
  max: 40,
  queue: []
};

shopify.add = function (item) {
  shopify.queue.push(item);
  if (!shopify.isRunning) {
    shopify.run();
  }
};

shopify.retry = function (item) {
  shopify.queue.unshift(item);
  if (!shopify.isRunning) {
    shopify.run();
  }
};

shopify.run = function () {
  return (0, _co2.default)(function* () {
    shopify.isRunning = true;
    while (shopify.queue.length > 0) {
      let headroom = shopify.max - (shopify.rate + shopify.inFlight);
      if (headroom <= 0) {
        headroom = 0;
      }
      let exponent = headroom * headroom / 9;
      if (exponent <= 0) {
        exponent = 1;
      }

      shopify.throttle = 500 / exponent;

      yield delay(shopify.throttle);
      shopify.request(shopify.queue.shift());
    }
    shopify.isRunning = false;
  });
};

shopify.request = function (item) {
  return (0, _co2.default)(function* () {
    shopify.inFlight += 1;
    var res = yield (0, _axios2.default)(item.request);
    shopify.inFlight -= 1;
    let body = res.data;
    if (body.errors) {
      item.deferred.reject(body.errors);
    } else {
      let limit = res.headers['x-shopify-shop-api-call-limit'];
      limit = limit.split('/');
      shopify.rate = parseInt(_lodash2.default.first(limit), 10);
      shopify.max = parseInt(_lodash2.default.last(limit), 10);

      item.deferred.resolve(res);
    }
  }).catch(function (res) {
    if (_lodash2.default.includes([429], res.status)) {
      shopify.retry(item);
    } else if (_lodash2.default.includes([422], res.status)) {
      let body = res.data;
      if (_lodash2.default.isArray(body.errors.asset)) {
        for (let error of body.errors.asset) {
          console.log(_colors2.default.red(`Error in ${ item.req.filepath } - ${ error }`));
        }
      }
      item.deferred.reject(body.errors);
    } else {
      item.deferred.reject(res);
    }
  });
};

var loadConfig = exports.loadConfig = function () {
  var deferred = _bluebird2.default.pending();
  _machinepackFs2.default.readJson({
    source: 'quickshot.json',
    schema: {}
  }).exec({
    error: deferred.reject,
    doesNotExist: function () {
      deferred.reject(new Error('Shop configuration is missing, have you run \'quickshot configure\'?'));
    },
    couldNotParse: function () {
      deferred.reject(new Error('Shop configuration is corrupt, you may need to delete \'quickshot.json\', and run \'quickshot configure\' again.'));
    },
    success: function (data) {
      if (!data.configVersion || data.configVersion < CONFIGVERSION) {
        deferred.reject(new Error('Shop configuration is from an older incompatible version of quickshot. You need to run \'quickshot configure\' again.'), data);
      }
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};

var shopifyRequest = exports.shopifyRequest = function (req) {
  req.deferred = _bluebird2.default.pending();
  shopify.add(req);
  return req.deferred.promise;
};

var getTarget = exports.getTarget = function* (config, argv) {
  if (argv['target']) {
    var targetName = argv['target'];
  }

  var target = null;
  if (_lodash2.default.isArray(config.targets)) {
    if (targetName) {
      target = _lodash2.default.find(config.targets, { target_name: targetName });
      if (!target) {
        throw new Error(`Could not find target '${ targetName }'`);
      }
    } else {
      var targetChoices = _lodash2.default.map(config.targets, target => {
        return `[${ target.target_name }] - '${ target.theme_name }' at ${ target.domain }.myshopify.com`;
      });
      if (config.targets.length > 1) {
        let choice = yield question([{
          type: 'list',
          name: 'target',
          message: 'Select target',
          default: null,
          choices: targetChoices
        }]);
        target = config.targets[_lodash2.default.indexOf(targetChoices, choice.target)];
      } else if (config.targets.length === 1) {
        target = _lodash2.default.first(config.targets);
      }
    }
  } else {
    throw new Error(`No targets configured! Run 'quickshot configure' and create a new target.`);
  }

  target.auth = 'Basic ' + new Buffer(`${ target.api_key }:${ target.password }`).toString('base64');
  return target;
};

var getShopPages = exports.getShopPages = function* (target) {
  var chunkSize = 250;
  var page = 1;
  var pages = [];
  var pagesBody = {
    pages: [0]
  };

  while (pagesBody.pages.length !== 0) {
    let pagesBody = yield this.shopifyRequest({
      method: 'get',
      url: `https://${ target.api_key }:${ target.password }this.${ target.domain }.myshopify.com/admin/pages.json?limit=${ chunkSize }&page=${ page }`
    });

    pages = pages.concat(pagesBody.pages);
    page += 1;
  }

  return pages;
};

var ts = exports.ts = function () {
  return (0, _moment2.default)().format('hh:mm:ss a');
};

var log = exports.log = function (text) {
  let color = arguments.length <= 1 || arguments[1] === undefined ? 'white' : arguments[1];

  console.log(_colors2.default[color](`${ ts() } - ${ text }`));
};

var listFiles = exports.listFiles = function () {
  let dirPath = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var deferred = _bluebird2.default.pending();
  var files = [];

  (0, _dive2.default)(_path2.default.join(process.cwd(), dirPath), { all: true }, function (err, file) {
    if (err) {
      deferred.reject(err);
    }
    if (file.match(/[\(\)]/)) {
      deferred.reject(new Error(`Filename may not contain parentheses, please rename - "${ file }"`));
    }
    files.push(file);
  }, function () {
    deferred.resolve(files);
  });

  return deferred.promise;
};
//# sourceMappingURL=data:application/json;base64,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SUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDMUUsUUFBSSxHQUFHLEVBQUU7QUFBRSxjQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQUU7QUFDakMsUUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3hCLGNBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyx1REFBdUQsR0FBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzlGO0FBQ0QsU0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUNqQixFQUFFLFlBQVk7QUFDYixZQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ3hCLENBQUMsQ0FBQTs7QUFFRixTQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUE7Q0FDeEIsQ0FBQSIsImZpbGUiOiJoZWxwZXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8gaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGNvIGZyb20gJ2NvJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBtZnMgZnJvbSAnbWFjaGluZXBhY2stZnMnXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5pbXBvcnQgY29sb3JzIGZyb20gJ2NvbG9ycydcbmltcG9ydCBpbnF1aXJlciBmcm9tICdpbnF1aXJlcidcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50J1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXG5pbXBvcnQgZGl2ZSBmcm9tICdkaXZlJ1xuXG5Qcm9taXNlLnByb21pc2lmeUFsbChpbnF1aXJlcilcblxuLyogZ2xvYmFsIENPTkZJR1ZFUlNJT04gKi9cblxuZXhwb3J0IHZhciBxdWVzdGlvbiA9IGZ1bmN0aW9uIChxdWVzdGlvbnMpIHtcbiAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5wZW5kaW5nKClcbiAgaW5xdWlyZXIucHJvbXB0KHF1ZXN0aW9ucywgZnVuY3Rpb24gKGFuc3dlcnMpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKGFuc3dlcnMpXG4gIH0pXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlXG59XG5cbmV4cG9ydCB2YXIgZGVsYXkgPSBmdW5jdGlvbiAobXMpIHtcbiAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5wZW5kaW5nKClcbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZSgpXG4gIH0sIG1zKVxuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxufVxuXG52YXIgc2hvcGlmeSA9IHtcbiAgaXNSdW5uaW5nOiBmYWxzZSxcbiAgdGhyb3R0bGU6IDAsXG4gIGluRmxpZ2h0OiAwLFxuICByYXRlOiAwLFxuICBtYXg6IDQwLFxuICBxdWV1ZTogW11cbn1cblxuc2hvcGlmeS5hZGQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICBzaG9waWZ5LnF1ZXVlLnB1c2goaXRlbSlcbiAgaWYgKCFzaG9waWZ5LmlzUnVubmluZykge1xuICAgIHNob3BpZnkucnVuKClcbiAgfVxufVxuXG5zaG9waWZ5LnJldHJ5ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgc2hvcGlmeS5xdWV1ZS51bnNoaWZ0KGl0ZW0pXG4gIGlmICghc2hvcGlmeS5pc1J1bm5pbmcpIHtcbiAgICBzaG9waWZ5LnJ1bigpXG4gIH1cbn1cblxuc2hvcGlmeS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBjbyhmdW5jdGlvbiAqKCkge1xuICAgIHNob3BpZnkuaXNSdW5uaW5nID0gdHJ1ZVxuICAgIHdoaWxlIChzaG9waWZ5LnF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBoZWFkcm9vbSA9IHNob3BpZnkubWF4IC0gKHNob3BpZnkucmF0ZSArIHNob3BpZnkuaW5GbGlnaHQpXG4gICAgICBpZiAoaGVhZHJvb20gPD0gMCkgeyBoZWFkcm9vbSA9IDAgfVxuICAgICAgbGV0IGV4cG9uZW50ID0gKChoZWFkcm9vbSAqIGhlYWRyb29tKSAvIDkpXG4gICAgICBpZiAoZXhwb25lbnQgPD0gMCkgeyBleHBvbmVudCA9IDEgfVxuXG4gICAgICBzaG9waWZ5LnRocm90dGxlID0gNTAwIC8gZXhwb25lbnRcblxuICAgICAgeWllbGQgZGVsYXkoc2hvcGlmeS50aHJvdHRsZSlcbiAgICAgIHNob3BpZnkucmVxdWVzdChzaG9waWZ5LnF1ZXVlLnNoaWZ0KCkpXG4gICAgfVxuICAgIHNob3BpZnkuaXNSdW5uaW5nID0gZmFsc2VcbiAgfSlcbn1cblxuc2hvcGlmeS5yZXF1ZXN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgcmV0dXJuIGNvKGZ1bmN0aW9uICooKSB7XG4gICAgc2hvcGlmeS5pbkZsaWdodCArPSAxXG4gICAgdmFyIHJlcyA9IHlpZWxkIGF4aW9zKGl0ZW0ucmVxdWVzdClcbiAgICBzaG9waWZ5LmluRmxpZ2h0IC09IDFcbiAgICBsZXQgYm9keSA9IHJlcy5kYXRhXG4gICAgaWYgKGJvZHkuZXJyb3JzKSB7XG4gICAgICBpdGVtLmRlZmVycmVkLnJlamVjdChib2R5LmVycm9ycylcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGxpbWl0ID0gcmVzLmhlYWRlcnNbJ3gtc2hvcGlmeS1zaG9wLWFwaS1jYWxsLWxpbWl0J11cbiAgICAgIGxpbWl0ID0gbGltaXQuc3BsaXQoJy8nKVxuICAgICAgc2hvcGlmeS5yYXRlID0gcGFyc2VJbnQoXy5maXJzdChsaW1pdCksIDEwKVxuICAgICAgc2hvcGlmeS5tYXggPSBwYXJzZUludChfLmxhc3QobGltaXQpLCAxMClcblxuICAgICAgaXRlbS5kZWZlcnJlZC5yZXNvbHZlKHJlcylcbiAgICB9XG4gIH0pLmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBpZiAoXy5pbmNsdWRlcyhbNDI5XSwgcmVzLnN0YXR1cykpIHtcbiAgICAgIHNob3BpZnkucmV0cnkoaXRlbSlcbiAgICB9IGVsc2UgaWYgKF8uaW5jbHVkZXMoWzQyMl0sIHJlcy5zdGF0dXMpKSB7XG4gICAgICBsZXQgYm9keSA9IHJlcy5kYXRhXG4gICAgICBpZiAoXy5pc0FycmF5KGJvZHkuZXJyb3JzLmFzc2V0KSkge1xuICAgICAgICBmb3IgKGxldCBlcnJvciBvZiBib2R5LmVycm9ycy5hc3NldCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGNvbG9ycy5yZWQoYEVycm9yIGluICR7aXRlbS5yZXEuZmlsZXBhdGh9IC0gJHtlcnJvcn1gKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXRlbS5kZWZlcnJlZC5yZWplY3QoYm9keS5lcnJvcnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW0uZGVmZXJyZWQucmVqZWN0KHJlcylcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCB2YXIgbG9hZENvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5wZW5kaW5nKClcbiAgbWZzLnJlYWRKc29uKHtcbiAgICBzb3VyY2U6ICdxdWlja3Nob3QuanNvbicsXG4gICAgc2NoZW1hOiB7fVxuICB9KS5leGVjKHtcbiAgICBlcnJvcjogZGVmZXJyZWQucmVqZWN0LFxuICAgIGRvZXNOb3RFeGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignU2hvcCBjb25maWd1cmF0aW9uIGlzIG1pc3NpbmcsIGhhdmUgeW91IHJ1biBcXCdxdWlja3Nob3QgY29uZmlndXJlXFwnPycpKVxuICAgIH0sXG4gICAgY291bGROb3RQYXJzZTogZnVuY3Rpb24gKCkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignU2hvcCBjb25maWd1cmF0aW9uIGlzIGNvcnJ1cHQsIHlvdSBtYXkgbmVlZCB0byBkZWxldGUgXFwncXVpY2tzaG90Lmpzb25cXCcsIGFuZCBydW4gXFwncXVpY2tzaG90IGNvbmZpZ3VyZVxcJyBhZ2Fpbi4nKSlcbiAgICB9LFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBpZiAoIWRhdGEuY29uZmlnVmVyc2lvbiB8fCBkYXRhLmNvbmZpZ1ZlcnNpb24gPCBDT05GSUdWRVJTSU9OKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ1Nob3AgY29uZmlndXJhdGlvbiBpcyBmcm9tIGFuIG9sZGVyIGluY29tcGF0aWJsZSB2ZXJzaW9uIG9mIHF1aWNrc2hvdC4gWW91IG5lZWQgdG8gcnVuIFxcJ3F1aWNrc2hvdCBjb25maWd1cmVcXCcgYWdhaW4uJyksIGRhdGEpXG4gICAgICB9XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlXG59XG5cbmV4cG9ydCB2YXIgc2hvcGlmeVJlcXVlc3QgPSBmdW5jdGlvbiAocmVxKSB7XG4gIHJlcS5kZWZlcnJlZCA9IFByb21pc2UucGVuZGluZygpXG4gIHNob3BpZnkuYWRkKHJlcSlcbiAgcmV0dXJuIHJlcS5kZWZlcnJlZC5wcm9taXNlXG59XG5cbmV4cG9ydCB2YXIgZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gKihjb25maWcsIGFyZ3YpIHtcbiAgaWYgKGFyZ3ZbJ3RhcmdldCddKSB7XG4gICAgdmFyIHRhcmdldE5hbWUgPSBhcmd2Wyd0YXJnZXQnXVxuICB9XG5cbiAgdmFyIHRhcmdldCA9IG51bGxcbiAgaWYgKF8uaXNBcnJheShjb25maWcudGFyZ2V0cykpIHtcbiAgICBpZiAodGFyZ2V0TmFtZSkge1xuICAgICAgdGFyZ2V0ID0gXy5maW5kKGNvbmZpZy50YXJnZXRzLCB7dGFyZ2V0X25hbWU6IHRhcmdldE5hbWV9KVxuICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0YXJnZXQgJyR7dGFyZ2V0TmFtZX0nYClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRhcmdldENob2ljZXMgPSBfLm1hcChjb25maWcudGFyZ2V0cywgKHRhcmdldCkgPT4geyByZXR1cm4gYFske3RhcmdldC50YXJnZXRfbmFtZX1dIC0gJyR7dGFyZ2V0LnRoZW1lX25hbWV9JyBhdCAke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb21gIH0pXG4gICAgICBpZiAoY29uZmlnLnRhcmdldHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsZXQgY2hvaWNlID0geWllbGQgcXVlc3Rpb24oW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgIG5hbWU6ICd0YXJnZXQnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1NlbGVjdCB0YXJnZXQnLFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIGNob2ljZXM6IHRhcmdldENob2ljZXNcbiAgICAgICAgICB9XG4gICAgICAgIF0pXG4gICAgICAgIHRhcmdldCA9IGNvbmZpZy50YXJnZXRzW18uaW5kZXhPZih0YXJnZXRDaG9pY2VzLCBjaG9pY2UudGFyZ2V0KV1cbiAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnRhcmdldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRhcmdldCA9IF8uZmlyc3QoY29uZmlnLnRhcmdldHMpXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgTm8gdGFyZ2V0cyBjb25maWd1cmVkISBSdW4gJ3F1aWNrc2hvdCBjb25maWd1cmUnIGFuZCBjcmVhdGUgYSBuZXcgdGFyZ2V0LmApXG4gIH1cblxuICB0YXJnZXQuYXV0aCA9ICdCYXNpYyAnICsgbmV3IEJ1ZmZlcihgJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9YCkudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gIHJldHVybiB0YXJnZXRcbn1cblxuZXhwb3J0IHZhciBnZXRTaG9wUGFnZXMgPSBmdW5jdGlvbiAqKHRhcmdldCkge1xuICB2YXIgY2h1bmtTaXplID0gMjUwXG4gIHZhciBwYWdlID0gMVxuICB2YXIgcGFnZXMgPSBbXVxuICB2YXIgcGFnZXNCb2R5ID0ge1xuICAgIHBhZ2VzOiBbMF1cbiAgfVxuXG4gIHdoaWxlIChwYWdlc0JvZHkucGFnZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgbGV0IHBhZ2VzQm9keSA9IHlpZWxkIHRoaXMuc2hvcGlmeVJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgIHVybDogYGh0dHBzOi8vJHt0YXJnZXQuYXBpX2tleX06JHt0YXJnZXQucGFzc3dvcmR9dGhpcy4ke3RhcmdldC5kb21haW59Lm15c2hvcGlmeS5jb20vYWRtaW4vcGFnZXMuanNvbj9saW1pdD0ke2NodW5rU2l6ZX0mcGFnZT0ke3BhZ2V9YFxuICAgIH0pXG5cbiAgICBwYWdlcyA9IHBhZ2VzLmNvbmNhdChwYWdlc0JvZHkucGFnZXMpXG4gICAgcGFnZSArPSAxXG4gIH1cblxuICByZXR1cm4gcGFnZXNcbn1cblxuZXhwb3J0IHZhciB0cyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG1vbWVudCgpLmZvcm1hdCgnaGg6bW06c3MgYScpXG59XG5cbmV4cG9ydCB2YXIgbG9nID0gZnVuY3Rpb24gKHRleHQsIGNvbG9yID0gJ3doaXRlJykge1xuICBjb25zb2xlLmxvZyhjb2xvcnNbY29sb3JdKGAke3RzKCl9IC0gJHt0ZXh0fWApKVxufVxuXG5leHBvcnQgdmFyIGxpc3RGaWxlcyA9IGZ1bmN0aW9uIChkaXJQYXRoID0gJycpIHtcbiAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5wZW5kaW5nKClcbiAgdmFyIGZpbGVzID0gW11cblxuICBkaXZlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBkaXJQYXRoKSwgeyBhbGw6IHRydWUgfSwgZnVuY3Rpb24gKGVyciwgZmlsZSkge1xuICAgIGlmIChlcnIpIHsgZGVmZXJyZWQucmVqZWN0KGVycikgfVxuICAgIGlmIChmaWxlLm1hdGNoKC9bXFwoXFwpXS8pKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKGBGaWxlbmFtZSBtYXkgbm90IGNvbnRhaW4gcGFyZW50aGVzZXMsIHBsZWFzZSByZW5hbWUgLSBcIiR7ZmlsZX1cImApKVxuICAgIH1cbiAgICBmaWxlcy5wdXNoKGZpbGUpXG4gIH0sIGZ1bmN0aW9uICgpIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKGZpbGVzKVxuICB9KVxuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlXG59XG4iXX0=