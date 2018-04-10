var express = require('express')
    ,http = require('http')
    ,path = require('path');

var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var static = require('serve-static');
var expressSession = require('express-session');

// 파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

// 클라이언트에서 ajax로 요청했을 때 CORS(다중 서버 접속) 지원)
var cors = require('cors');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    ssaveUninitialized: true
}));
app.use(cors());

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'uploads')
    },
    filename: function(req, file, callback){
        callback(null, file.originalname + Date.now())
    }
});

var upload = multer({
    storage: storage,
    limits: {
        filers : 10,
        fileSize : 1024 * 1024 * 1024
    }
});


var router = express.Router();

// 상품 정보 라우팅 함수
router.route('/process/product').get(function(req, res){
    console.log('/process/product 호출 됨');
    
    if(req.session.user){
        res.redirect('/product.html');
    }else{
        res.redirect('/login2.html');
    }
});

//로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req, res){
    console.log('/process/login 호출 됨');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if(req.session.user){
        console.log('이미 로그인되어 상품 페이지로 이동합니다.');
        
        res.redirect('/product.html');
    }else{
        req.session.user = {
            id: paramId,
            name: 'moonbyul',
            authorized: true
        };
        
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>Param Id : ' + paramId + '</p></div>');
        res.write('<div><p>Param Password : ' + paramPassword + '</p></div>');
        res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
        res.end();
        //res.redirect('/successLogin.html');
    }
});

//로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res){
    console.log('/process/logout 호출 됨');
    
    if(req.session.user){
        //로그인 된 상태
        console.log('log out');
        
        req.session.destroy(function(err){
            if(err){throw err;}
            
            console.log('destory session and logout');
            res.redirect('/login2.html');
        });
    }else{
        //로그인 안 된 상태
        console.log('Not login User');
        
        res.redirect('login2.html');
    }
});

//photo upload
router.route('/process/photo').post(upload.array('photo',1), function(req, res){
    console.log('/process/photo 호출 됨');
    
    try{
        var files = req.files;
        
        console.dir('#=======업로드된 첫번째 파일 정보====#');
        console.dir(req.files[0]);
        console.dir('#========#');
        
        var originalname = '',
            filename = '',
            mimetype ='',
            size = 0;
        
        if(Array.isArray(files)){
            console.log("배열에 들어있는 파일 갯수 : %d", files.length);
            
            for(var idx = 0; idx < files.length; idx++){
                originalname = files[idx].originalname;
                filename = files[idx].filename;
                mimetype = files[idx].mimetype;
                size = files[idx].size;
            }
        }else{
            console.log("파일 갯수: 1");
            
            originalname = files[idx].originalname;
            filename = files[idx].filename;
            mimetype = files[idx].mimetype;
            size = files[idx].size;
            
        }
        
        console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
        
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h1>파일 업로드 성공</h1>');
        res.write('<hr/>');
        res.write('<div><p>원본 파일 이름 : ' + originalname + '</p></div>');
        res.write('<div><p>저장 파일 명 : ' + filename + '</p></div>');
        res.write('<div><p>MIME TYPE :' + mimetype + '</p></div>');
        res.write('<div><p>FILE SIZE :' + size + '</p></div>');
        res.end();
    }catch(err){
        console.dir(err.stack);
    }
});

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