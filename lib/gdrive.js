/**
 *
 * User: tom
 * Date: 12/9/12
 * Time: 6:25 PM
 * To change this template use File | Settings | File Templates.
 */
var https = require("https");


var baseUrl = "https://spreadsheets.google.com/feeds/cells/%KEY%/od6/public/basic?alt=json";
var GDrive = function (key) {
    this.url = baseUrl.replace(/%KEY%/, key);
};

GDrive.prototype.get = function (callback, errCallback) {
    https.get(this.url, function (res) {
        var data = "";
        console.log("Got response: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
        });

        res.on('end', function () {
            callback(data);
        });
    }).on('error', function (err) {
        console.log("Received error: " + err);
        errCallback(err);
    });
};

exports.GDrive = GDrive;


