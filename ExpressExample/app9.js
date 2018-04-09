var express = require('express')
    ,http = require('http')
    ,path = require('path')
    ,expressErrorHandler = require('express-error-handler');

var bodyParser = require('body-parser')
    ,static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));

app.use(static(path.join(__dirname, 'public')));

var router = express.Router();

router.route('/process/login').post(function(req, res){
    console.log('/process/login 처리함');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h1>Express response </h1>');
    res.write('<div><p>Param Id : ' + paramId + '</p></div>');
    res.write('<div><p>Param Password : ' + paramPassword + '</p></div>');
    res.end();
});

app.use('/', router);


/*
Error시 직접 처리해주는 부분
*/
app.all('*', function(req, res){
    res.status(404).send('<h1>ERROR 404 - Page Not Found</h1>');
});

/*
Error시 미들웨어 사용하여 처리, express-error-handler
*/
var errorHandler = expressErrorHandler({
    static:{
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000, function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});