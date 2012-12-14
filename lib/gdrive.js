/**
 *
 * User: tom
 * Date: 12/9/12
 * Time: 6:25 PM
 * To change this template use File | Settings | File Templates.
 */
var https = require("https"),
    Miso  = require("miso.dataset"),
    lodash = require("lodash");

var baseUrl = "https://spreadsheets.google.com/feeds/cells/%KEY%/%WORKSHEET%/public/basic?alt=json";
var GDrive = function (config) {
    this.url = baseUrl.replace(/%KEY%/, config.key);
    this.numSheets = config.numSheets || 1;
};

GDrive.prototype.get = function (callback, errCallback) {
    var counter,
        curr,
        successFunction,
        errFunction,
        dataPoints = [],
        total = this.numSheets;

    successFunction = function (index, res) {
        var data = "";
        console.log("Got response: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
        });

        res.on('end', function () {
            var jsonData = JSON.parse(data),
                misoData = new Miso.Dataset({
                    data: jsonData,
                    parser : Miso.Dataset.Parsers.GoogleSpreadsheet
                });
            misoData.fetch({
                success: function () {
                    dataPoints[index - 1] = this;
                    console.log("Data is: " + dataPoints);
                    if (dataPoints.length === total) {
                        callback(dataPoints);
                    }
                }
            });
        });
    };

    errFunction = function (err) {
        console.log("Received error: " + err);
        errCallback(err);
    };

    for (counter = 1; counter <= this.numSheets; counter = counter + 1) {
        https.get(this.url.replace(/%WORKSHEET%/, counter), lodash.bind(successFunction, this, counter)).
            on("error", errFunction);
    }

};

exports.GDrive = GDrive;


