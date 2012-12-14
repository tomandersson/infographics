/**
 * Controller for getting
 * User: tom
 * Date: 12/9/12
 * Time: 6:54 PM
 */

var GDrive  = require('../lib/gdrive').GDrive,
    lodash  = require('lodash');

var endpoints = {},
    globalData = {};

function _successHandler(item, dataset) {
    console.log("Got data for item '" + item + "': " + dataset);
    globalData[item] = dataset;
}

function _getDataForEndpoints() {
    var item,
        curr,
        errorHandler = function () {};

    for (item in endpoints) {
        if (endpoints.hasOwnProperty(item)) {
            curr = endpoints[item];
            curr.get(lodash.bind(_successHandler, this, item), errorHandler);
        }
    }
}

exports.createEndpoint = function (config) {
    if (config.name && config.key && config.type === "gdrive") {
        endpoints[config.name] = new GDrive(config.key, config.sheetIndex);

        _getDataForEndpoints();
    }
};

exports.getData = function (name) {
    if (!globalData[name]) {
        throw "No data for name '" + name + "'";
    }

    return globalData[name];
};

exports.hasEndpoint = function (name) {
    return endpoints[name] !== undefined;
};

setInterval(_getDataForEndpoints, 30000);