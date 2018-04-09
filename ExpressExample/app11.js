var express = require('express')
    ,http = require('http')
    ,path = require('path');

var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(static(path.join(__dirname, 'public')));
app.use(cookieParser());

var router = express.Router();

//Get 메소드를 이용한 토큰 정보 얻어오기. 
//params.id로 id속성에 접근
router.route('/process/users/:id').get(function(req, res){
    console.log('/process/users/:id 처리');
    
    var paramId = req.params.id;
    
    console.log('/process/users와 토큰%s를 이용해 처리함', paramId);
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id :' + paramId + '</p></div>');
    res.end();
})

///CookieParser
router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie 호출 됨');
    
    res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req, res){
    console.log('/process/setUserCookie 호출 됨');
    
    //set Cookie
    res.cookie('user',{
        id: 'mbyul',
        name: 'moonbyul',
        autorized : true
    });
    
    res.redirect('/process/showCookie');
})

app.use('/', router);

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