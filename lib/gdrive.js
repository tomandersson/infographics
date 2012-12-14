/**
 *
 * User: tom
 * Date: 12/9/12
 * Time: 6:25 PM
 * To change this template use File | Settings | File Templates.
 */
var https = require("https"),
    Miso  = require("miso.dataset");

var baseUrl = "https://spreadsheets.google.com/feeds/cells/%KEY%/%WORKSHEET%/public/basic?alt=json";
var GDrive = function (key, sheetIndex) {
    this.url = baseUrl.replace(/%KEY%/, key)
        .replace(/%WORKSHEET%/, sheetIndex || "1");
};

GDrive.prototype.get = function (callback, errCallback) {
    https.get(this.url, function (res) {
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
                    callback(this);
                }
            });
        });
    }).on('error', function (err) {
        console.log("Received error: " + err);
        errCallback(err);
    });
};

exports.GDrive = GDrive;


