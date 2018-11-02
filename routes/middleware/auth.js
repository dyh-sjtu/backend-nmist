const jwt = require('jsonwebtoken');
const AppUser = require('../../models/app-user');

// 权限中间件
exports.requiredLogin = (req, res, next) => {
	let _user = res.locals.user;
	if (!_user) {
		res.locals.admin = false;
		return res.redirect('/weintern/signIn');
	}
	next();
};

// 超级管理员权限
exports.requiredAdmin = (req, res, next) => {
	let _user = res.locals.user;
	if (_user.role !== 7) {
		console.log("没有权限");
		res.locals.admin = false;
		return res.render('404', {
			title: "没有权限",
			msg: "您没有权限，请联系超级管理员!"
		});
	}
	next();
};

// 私人定制超级管理员，具有可读可执行权限
exports.requirePartAdmin = (req, res, next) => {
	let _user = res.locals.user;
	if(_user.role !== 6 && _user.role !== 7) {
		return res.render('404', {
			title: '没有权限',
			msg: "您没有权限，请联系超级管理员!"
		})
	}
	next();
};

// app的权限是token，token中保存用户的信息和某个特定字符串的加密信息，token在app用户第一次登录时返回给客户端，客户端保存至本地cookie
exports.requiredToken = (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers.token;
	if (!token) {
		let errMsg = {
			code: 4003,
			msg: 'token授权失败,请提供token!'
		};
		return res.json({
			success: 0,
			data: errMsg
		})
	}else {
		jwt.verify(token, 'secret', (err, decoded) => {
			if (err) {
				let errMsg = {
					code: 4004,
					msg: 'token格式有误!'
				};
				return res.json({
					success: 0,
					data:errMsg
				})
			}
			req.userInfo = decoded;
			AppUser.findOne({token: token}, (err, appUser) => {
				if (err) {
					console.log(err);
				}
				if (appUser) {
					next();
				}
				if (!appUser) {
					let errMsg = {
						code: 4005,
						msg: 'token不存在, 请重新登录!'
					};
					return res.json({
						success: 0,
						data: errMsg
					})
				}
			});
		})
	}
};
