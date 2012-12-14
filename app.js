/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    dataController = require('./controllers/dataController'),
    configReader = require('./lib/configReader');


var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function () {
    dataController.createEndpoint({'name': 'spreadsheet', 'key': '0Ar-SRfK6xubBdDhtd3c0YUVzZE43RWlmdFAzNF94eGc', 'type': 'gdrive', 'sheetIndex': 1});
    setInterval(configReader.readFiles, 30000, './config');
    app.get('/doc', function (req, res) {
        console.log("Got request for doc");
        res.setHeader('contentType', 'application/json');
        res.send(dataController.getData('spreadsheet'));
    });
    console.log("Express server listening on port " + app.get('port'));
});
