let express = require('express');
let router = express.Router();
let User = require('../../models/user');
// 权限中间件
let Auth = require('../middleware/auth');
let Company = require('../../models/company');
let Category = require('../../models/category');


// 用户列表
router.get('/tsmsjtu/user/list', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		User.fetch((err, users) => {
			let localUser = req.session.user;
			Company.fetch((err, companies) => {
				Category.fetch((err, categories) => {
					res.render('userList', {
						title: '用户列表页',
						users: users,
						localUser: localUser,
						companies: companies,
						categories: categories
					})
				})
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

// 删除用户
router.delete('/tsmsjtu/user/list/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let id = req.query.id;
		if (id) {
			User.remove({
				_id: id
			}, (err, user) => {
				return res.json({
					success: 1
				})
			})
		}
	} catch (err) {
		console.log('err', err)
	}
});

// 超级管理员修改用户权限
router.post('/tsmsjtu/user/list/role', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let userId = req.body.userId;
		let newRole = parseInt(req.body.newRole);
		if (userId && newRole) {
			User.findOne({_id: userId})
				.exec((err, user) => {
					user.role = newRole;
					user.partDepartment = [];
					user.company = '';
					user.department = '';
					user.firstSave = false;
					user.save((err, user) => {
						return res.json({
							success: 1
						})
					})
				})
		}
	} catch (err) {
		console.log('err', err)
	}
});

// 超级管理员修改用户所属行业
router.post('/tsmsjtu/user/list/department', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let userId = req.body.userDepartmentId;
		let newDepartment = req.body.department;
		if (userId && newDepartment) {
			User.findOne({_id: userId})
				.exec((err, user) => {
					user.department = newDepartment;
					user.firstSave = false;
					user.save((err, user) => {
						return res.json({
							success: 1
						})
					})
				})
		}
	} catch (err) {
		console.log('err', err)
	}
});

// 超级管理员修改用户所属公司
router.post('/tsmsjtu/user/list/company', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let userId = req.body.userCompanyId;
		let newCompany = req.body.company;
		if (userId && newCompany) {
			User.findOne({_id: userId})
				.exec((err, user) => {
					user.company = newCompany;
					user.firstSave = false;
					user.save((err, user) => {
						return res.json({
							success: 1
						})
					})
				})
		}
	} catch (err) {
		console.log('err', err)
	}
});

router.post('/tsmsjtu/user/list/categories', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let userId = req.body.userId;
		let partDepartment = req.body.partDepartment;
		if (userId) {
			User.findOne({_id: userId})
				.exec((err, user) => {
					user.partDepartment = partDepartment;
					user.firstSave = false;
					user.save((err, user) => {
						return res.json({
							success: 1
						})
					})
				})
		}
	} catch (err) {
		console.log('err', err)
	}
});

module.exports = router;