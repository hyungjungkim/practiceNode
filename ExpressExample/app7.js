var express = require('express')
    ,http = require('http')
    ,path = require('path');

var bodyParser = require('body-parser')
    ,static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));

app.use(static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    console.log('first request middeware');
    
    var parmId = req.body.id || req.query.id;
    var parmPassword = req.body.password || req.query.password;
    
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express response </h1>');
    res.write('<div><p>Param Id : ' + parmId + '</p></div>');
    res.write('<div><p>Param Password : ' + parmPassword + '</p></div>');
    res.end();
});

http.createServer(app).listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});