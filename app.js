
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
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

var result = {
		access_token: ""
};
// 다음 블로그 api 접근하기 위해 access_token 얻는 과정
// 
app.get('/', function(req, res){
	res.render('req_token', { title: 'Express' });
});
app.get('/oauth', function(req, res){
	res.render('get_token');
});
app.get('/get_token', function(req, res){
	// request param -> access_token 로그로 출력
	console.log(req.query.access_token);
	// access_token을 받지 않은 상태면 받음
	if(result.access_token == ""){
		result.access_token = req.query.access_token;
	}
	// 결과값을 json형태로 출력
	res.json(result);
});
var client_id = 'T8CCS6qgFCPQGMnW0mDf';
var client_secret = 'lc08IcDYGw';
app.get('/search/blog', function (req, res) {
		console.log(req.query.query);
	   var api_url = 'https://openapi.naver.com/v1/search/blog.json?query=' + encodeURI(req.query.query); // json
																										// 결과
	// var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' +
	// encodeURI(req.query.query); // xml 결과
	   var request = require('request');
	   var options = {
	       url: api_url,
	       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
	    };
	   request.get(options, function (error, response, body) {
	     if (!error && response.statusCode == 200) {
	       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
	       res.end(body);
	     } else {
	       res.status(response.statusCode).end();
	       console.log('error = ' + response.statusCode);
	     }
	     });
	   });
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
