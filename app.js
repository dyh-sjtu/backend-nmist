const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
let mongoose = require('mongoose');
let MongoStore = require('connect-mongo')(session);
let multipart = require('connect-multiparty');

let dbUrl = "mongodb://localhost/tsmsjtu";
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, {useMongoClient: true});

let port = process.env.PORT || 8100;
let app = express();

app.set('views', 'views/pages');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extend: true
}));
app.use(multipart());
app.use(express.static(path.join(__dirname, 'public')));  // 静态文件，如css,js,excel,image等都放在此处

let moment = require('moment');
moment.locale('zh-cn');
app.locals.moment = moment;

app.use(session({
	secret: "tsmsjtu",
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 5
	}, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
	store: new MongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}));

app.use((req, res, next) => {
	let _user = req.session.user;
	if(_user){
		res.locals.user = _user;
	}
	next();
});


// 用于开发环境的调试堆栈信息
if ('development' === app.get('env')) {
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

// 首页
let index = require('./routes/index/index');
let messageEdit = require('./routes/index/message');

// 用户相关页
let user = require('./routes/user/user');
let userCenter = require('./routes/user/userCenter');
let userList = require('./routes/user/userList');
// app用户账号控制
let appUser = require('./routes/user/app-user');
let appUserExcel = require('./routes/user/userExcel');

// 行业相关页
let category = require('./routes/company/category');
let company = require('./routes/company/company');

// api相关
let getCompany = require('./routes/api/company');
let getAppUser = require('./routes/api/app-user');

// 中间状态提示页
let status = require('./routes/status/status');

let notfound = require('./routes/404/404');

// 路由的切换页面
// 首页
app.use('/', index);
app.use('/', messageEdit);

// 用户相关路由
// 用户登录注册
app.use('/', user);
// 用户中心
app.use('/', userCenter);
// 用户列表
app.use('/', userList);
app.use('/', appUser);
app.use('/', appUserExcel);

// 行业及公司业态相关页
app.use('/', category);
app.use('/', company);

//api接口
app.use('/api', getCompany);
app.use('/api', getAppUser);

// status:success || fail 错误提示路由
app.use('/', status);

// 404页面
app.use('/', notfound);

// 监听开发环境的端口或者设定的端口号
app.listen(port, () => {
	console.log('server running on port: ' + port);
});
