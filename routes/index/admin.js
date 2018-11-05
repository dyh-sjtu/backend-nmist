const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Auth = require('../middleware/auth');
const ApplyUser = require('../../models/applyUser');
const ApplyEmail = require('../../models/applyEmail');


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

router.get('/admin/applyList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		ApplyEmail.fetch((err, applyEmail) => {
			ApplyUser.fetch((err, applyUsers) => {
				res.render('applyList', {
					title: '软件申请',
					localUser: localUser,
					applyUsers: applyUsers,
					email: applyEmail && applyEmail[0]
				})
			})
		})
	} catch (err) {
		console.log(err);
	}
});

router.post('/admin/email/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let emailId = req.body.emailId;
		let email = req.body.email;
		if (email) {
			if (emailId) {
				ApplyEmail.findById(emailId, (err, applyEmail) => {
					applyEmail.email = email;
					applyEmail.save((err, applyEmail) => {
						if (err) console.log(err);
						return res.json({
							success: 1
						})
					})
				})
			}else {
				let _emailObj = new ApplyEmail({
					email: email
				});
				_emailObj.save((err, email) => {
					if (err) console.log(err)
					return res.json({
						success: 1
					})
				})
			}
		}
	} catch (err) {
		console.log('err', err)
	}
})

router.delete('/admin/applyList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let applyUserId = req.query.applyUserId;
		if (applyUserId) {
			ApplyUser.remove({_id: applyUserId}, (err, applyUser) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	} catch (err) {
		console.log(err);
	}
});

router.post('/admin/applyList/changeStatus', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let applyUserId = req.query.applyUserId;
		if (applyUserId) {
			ApplyUser.findById(applyUserId, (err, applyUser) => {
				applyUser.dealStatus = true;
				applyUser.save((err, applyUser) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});


module.exports = router;