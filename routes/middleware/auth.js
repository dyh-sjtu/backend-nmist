// 权限中间件
exports.requiredLogin = (req, res, next) => {
	let _user = res.locals.user;
	if (!_user) {
		res.locals.admin = false;
		return res.redirect('/admin/user/signIn');
	}
	next();
};

// 超级管理员权限
exports.requiredAdmin = (req, res, next) => {
	let _user = res.locals.user;
	if (_user.role !== 7) {
		res.locals.admin = false;
		return res.render('404', {
			msg: "您没有权限，请联系超级管理员!"
		});
	}
	next();
};
