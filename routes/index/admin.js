const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Auth  = require('../middleware/auth');
const ApplyUser = require('../../models/applyUser');


// 所有静态页面
router.get('/admin', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		User.fetch((err, users) => {
			res.render("userList", {
				localUser: localUser,
				users: users
			})
		})
	}catch (err) {
		console.log("err", err)
	}
});

router.get('/admin/applyList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		ApplyUser.fetch((err, applyUsers) => {
			res.render('applyList', {
				localUser: localUser,
				applyUsers: applyUsers
			})
		})
	}catch(err) {
		console.log(err);
	}
});

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
	}catch(err) {
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
	}catch(err) {
		console.log('err', err);
	}
});


module.exports = router;