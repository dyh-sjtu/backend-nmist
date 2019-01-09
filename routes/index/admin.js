const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Auth = require('../middleware/auth');
const ApplyUser = require('../../models/applyUser');
const ApplyEmail = require('../../models/applyEmail');
const Software = require('../../models/software');
const Upload = require('../middleware/upload');


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


// 软件列表
router.get('/admin/softwareList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Software.fetch((err, softwares) => {
			res.render('softwareList', {
				title: '软件列表',
				localUser: localUser,
				softwares: softwares
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入软件添加页面
router.get('/admin/software/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("softwareAdd", {
			title: '软件列表',
			localUser: localUser,
			software: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/software/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let softwareId = req.params.id;
		let localUser = res.locals.user;
		if (softwareId) {
			Software.findById(softwareId, (err, software) => {
				res.render('softwareAdd', {
					title: '软件列表',
					localUser: localUser,
					software: software
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 软件信息保存
router.post('/admin/software/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let softwareObj = req.body;
		if (softwareObj.softwareId) {
			Software.findById(softwareObj.softwareId, (err, software) => {
				let _softwareObj = Object.assign(software, softwareObj);
				_softwareObj.save((err, software) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}else {
			let _softwareObj = new Software(softwareObj);
			_softwareObj.save((err, software) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 软件删除
router.delete('/admin/softwareList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let softwareId = req.query.softwareId;
		if (softwareId) {
			Software.remove({_id: softwareId}, (err, software) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 上传图片
// router.post('/admin/software/image/upload', Auth.requiredLogin, Auth.requiredAdmin, Upload.saveFileWithNoTimestamp, (req, res) => {
// 	try {
// 		if (req.newFile) {
// 			return res.json({
// 				code: 0,
// 				data: {
// 					src: req.newFile
// 				}
// 			})
// 		}else {
// 			return res.json({
// 				code: 1,
// 				msg: "上传图片失败,请重试",
// 			})
// 		}
// 	}catch (err) {
// 		console.log('err', err);
// 	}
// });

// 上传软件
// router.post('/admin/software/file/upload', Auth.requiredLogin, Auth.requiredAdmin, Upload.saveFileWithNoTimestamp, (req, res) => {
// 	try {
// 		if (req.newFile) {
// 			return res.json({
// 				code: 0,
// 				data: {
// 					src: req.newFile
// 				}
// 			})
// 		}else {
// 			return res.json({
// 				code: 1,
// 				msg: "上传软件失败,请重试",
// 			})
// 		}
// 	}catch (err) {
// 		console.log('err', err);
// 	}
// });


module.exports = router;