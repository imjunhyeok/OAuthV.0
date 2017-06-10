
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/access_token', function(req, res){
	res.render('tkn');
});
app.get('/users', user.list);
var code = undefined;
var tkn = undefined;
app.get('/oauth', function(req, res){
	code = {'code' : req.query.code};
	tkn = {'token' : req.query.access_token};
	console.log(code);
	console.log(tkn);
	if((code.code !== undefined) && (tkn === undefined))
		res.redirect('/access_token');
	res.json(code + '\n' + tkn);
});
app.get('/getcode', function(req, res){
	
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
