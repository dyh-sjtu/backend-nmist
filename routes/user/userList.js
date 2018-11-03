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


module.exports = router;