const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const ProjectCategory = require('../../models/projectCategory');
const Project = require('../../models/project');

// 客户案例列表
router.get('/admin/projectCategoryList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		ProjectCategory.fetch((err, projectCategorys) => {
			res.render('projectCategoryList', {
				title: '案例类型',
				localUser: localUser,
				projectCategorys: projectCategorys
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入客户案例添加页面
router.get('/admin/projectCategory/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("projectCategoryAdd", {
			title: '案例类型',
			localUser: localUser,
			projectCategory: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/projectCategory/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectCategoryId = req.params.id;
		let localUser = res.locals.user;
		if (projectCategoryId) {
			ProjectCategory.findById(projectCategoryId, (err, projectCategory) => {
				res.render('projectCategoryAdd', {
					title: '案例类型',
					localUser: localUser,
					projectCategory: projectCategory
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 客户案例信息保存
router.post('/admin/projectCategory/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectCategoryObj = req.body;
		if (projectCategoryObj.projectCategoryId) {
			ProjectCategory.findById(projectCategoryObj.projectCategoryId, (err, projectCategory) => {
				let _projectCategoryObj = Object.assign(projectCategory, projectCategoryObj);
				_projectCategoryObj.save((err, projectCategory) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		} else {
			let _projectCategoryObj = new ProjectCategory(projectCategoryObj);
			_projectCategoryObj.save((err, projectCategory) => {
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

// 客户案例删除
router.delete('/admin/projectCategoryList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectCategoryId = req.query.projectCategoryId;
		if (projectCategoryId) {
			// 案例类型删除后，该案例类型下的所有案例都将删除
			Project.find({category: projectCategoryId}, (err, projects) => {
				projects.forEach((project, index) => {
					project.remove();
				})
			});
			
			ProjectCategory.remove({_id: projectCategoryId}, (err, projectCategory) => {
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

router.get('/index/projectCategory', (req, res) => {
	try {
		ProjectCategory.find({}).exec((err, projectCategorys) => {
			return res.json({
				success: 1,
				data: {
					projectCategorys: projectCategorys
				}
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});


module.exports = router;