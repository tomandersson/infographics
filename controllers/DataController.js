/**
 * Controller for getting
 * User: tom
 * Date: 12/9/12
 * Time: 6:54 PM
 */

var GDrive = require("../lib/gdrive").GDrive;

exports.DataController = (function () {
    var endpoints = {},
        data;

    function createEndpoint(config) {
        if (config.name && config.key && config.type === "gdrive") {
            endpoints[config.name] = new GDrive(config.key);

            _getDataForEndpoints();
        }
    }

    function getData(name) {
        if (!data[name]) {
            throw "No data for name '" + name + "'";
        }

        return data[name];
    }

    function _successHandler(item, resData) {
        data[item] = resData;
    }

    function _getDataForEndpoints() {
        var item,
            curr,
            successHandler,
            errorHandler = function () {};

        for (item in endpoints) {
            if (endpoints.hasOwnProperty(item)) {
                curr = endpoints[item];

                successHandler = function (data) {
                    console.log("Got data for item '" + item + "': " + data);
                    data[item] = JSON.parse(data);
                };

                curr.get(successHandler, errorHandler);
            }
        }
    }

    function hasEndpoint(name) {
        return endpoints[name] !== undefined;
    }

    setInterval(_getDataForEndpoints, 30000);

    return {
        "getData": getData,
        "createEndpoint": createEndpoint,
        "hasEndpoint": hasEndpoint
    };
}());