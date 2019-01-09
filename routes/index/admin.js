const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Auth = require('../middleware/auth');



// 所有静态页面
router.get('/admin', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		User.fetch((err, users) => {
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


module.exports = router;