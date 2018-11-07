let express = require('express');
let router = express.Router();
let User = require('../../models/user');
// 权限中间件
let Auth = require('../middleware/auth');


// 用户列表
router.get('/admin/userList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		User.fetch((err, users) => {
			let localUser = res.locals.user;
			res.render("userList", {
				title: '用户管理',
				localUser: localUser,
				users: users
			})
		})
	} catch (err) {
		console.log("err", err)
	}
});


router.delete('/admin/userList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let userId = req.query.userId;
		if (userId) {
			User.remove({_id: userId}, (err, user) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	}catch (err) {
		console.log('err', err)
	}
})

router.post("/admin/user/role", Auth.requiredLogin, Auth.requiredSuperAdmin, (req, res) => {
	try {
		let userId = req.query.userId;
		let role = req.body.role;
		if (userId) {
			User.findById(userId, (err, user) => {
				user.role = role;
				user.firstSave = false;
				user.save((err, user) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}
	}catch(err) {
		console.log(err);
	}
});


router.get("/admin/userCenter", Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		res.render("userCenter", {
			title: '个人中心',
			localUser: res.locals.user
		})
	}catch(err) {
		if (err) console.log(err);
	}
});

router.post("/admin/user/modifyPassword", Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let _user = res.locals.user;
		let password = req.body.password;
		console.log(_user._id, password)
		if (_user._id && password) {
			User.findById(_user._id, (err, user) => {
				user.password = password;
				user.firstSave = true;
				user.save((err, user) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}
	}catch(err) {
		console.log(err);
	}
})


module.exports = router;