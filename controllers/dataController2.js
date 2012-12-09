/**
 * Controller for getting
 * User: tom
 * Date: 12/9/12
 * Time: 6:54 PM
 */

var GDrive  = require('../lib/gdrive').GDrive,
    lodash  = require('lodash');

var endpoints = {},
    data;

function _successHandler(item, data) {
    console.log("Got data for item '" + item + "': " + data);
    data[item] = JSON.parse(data);
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
        endpoints[config.name] = new GDrive(config.key);

        _getDataForEndpoints();
    }
};

exports.getData = function (name) {
    if (!data[name]) {
        throw "No data for name '" + name + "'";
    }

    return data[name];
};

exports.hasEndpoint = function (name) {
    return endpoints[name] !== undefined;
};

setInterval(_getDataForEndpoints, 10000);