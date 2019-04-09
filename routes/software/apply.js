const express = require('express');
const router = express.Router();
const Auth  = require('../middleware/auth');
const ApplyUser = require('../../models/applyUser');
const ApplyEmail = require('../../models/applyEmail');



router.get('/admin/applyList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		let pageIndex = parseInt(Object.keys(req.query).length > 0 && req.query.pageIndex) || 0;
		let pageSize = 8;
		ApplyEmail.fetch((err, applyEmail) => {
			ApplyUser.find({}).sort({'meta.createAt': -1}).limit(pageSize).skip(pageIndex * pageSize).exec((err, applyUsers) => {
				ApplyUser.count().exec((err, applyUserNum) => {
					res.render("applyList", {
						title: '软件申请',
						localUser: localUser,
						applyUsers: applyUsers,
						pageSize: pageSize,
						pageIndex: pageIndex,
						totalPage: Math.ceil(applyUserNum / pageSize),
						email: applyEmail && applyEmail[0]
					})
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
			} else {
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