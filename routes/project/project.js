const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const ProjectCategory = require('../../models/projectCategory');
const Project = require('../../models/project');

// 产品案例列表
router.get('/admin/projectList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		let pageIndex = parseInt(Object.keys(req.query).length > 0 && req.query.pageIndex) || 0;
		let pageSize = 8;
		Project.find({}).sort({'meta.createAt': -1}).limit(pageSize).skip(pageIndex * pageSize).exec((err, projects) => {
			Project.count().exec((err, projectNum) => {
				res.render("projectList", {
					title: '产品案例',
					localUser: localUser,
					projects: projects,
					pageSize: pageSize,
					pageIndex: pageIndex,
					totalPage: Math.ceil(projectNum / pageSize)
				})
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

// 进入客户案例添加页面
router.get('/admin/project/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		ProjectCategory.fetch((err, projectCategorys) => {
			res.render("projectAdd", {
				title: '产品案例',
				localUser: localUser,
				project: '',
				projectCategorys: projectCategorys
			})
		});
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/project/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectId = req.params.id;
		let localUser = res.locals.user;
		if (projectId) {
			Project.findById(projectId, (err, project) => {
				ProjectCategory.fetch((err, projectCategorys) => {
					res.render('projectAdd', {
						title: '案例类别',
						localUser: localUser,
						project: project,
						projectCategorys: projectCategorys
					})
				});
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 客户案例信息保存
router.post('/admin/project/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectObj = req.body;
		if (projectObj.projectId) {
			Project.findById(projectObj.projectId, (err, project) => {
				let _projectObj = Object.assign(project, projectObj);
				_projectObj.save((err, project) => {
					if (err) console.log(err);
					
					// 将修改案例类型之前案例所在的类型下的案例删除掉
					ProjectCategory.findOne({projects: project._id}, (err, projectCategory) => {
						let index = projectCategory.projects.indexOf(project._id);
						projectCategory.projects.splice(index, 1);
						projectCategory.save((err, projectCategory) => {
							if (err) console.log(err);
							// 删除先前所在类型记录之后再将当前案例存入相应案例类型中
							ProjectCategory.findById(project.category, (err, projectCategory) => {
								projectCategory.projects.push(project._id);
								projectCategory.save((err, projectCategory) => {
									if (err) console.log(err);
									return res.json({
										success: 1
									})
								})
							});
						})
					});
				})
			})
		} else {
			let _projectObj = new Project(projectObj);
			if (_projectObj.category) {
				_projectObj.save((err, project) => {
					if (err) console.log(err);
					ProjectCategory.findById(project.category, (err, projectCategory) => {
						if (err) console.log(err);
						projectCategory.projects.push(project._id);
						projectCategory.save((err, projectCategory) => {
							if (err) console.log(err);
							return res.json({
								success: 1
							})
						})
					});
				})
			} else {
				return res.json({
					success: 0,
					msg: "请选择案例类型, 否则无法保存!"
				})
			}
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 客户案例删除
router.delete('/admin/projectList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let projectId = req.query.projectId;
		if (projectId) {
			
			// 产品案例删除后，其案例类型下的该案例将删除
			ProjectCategory.findOne({projects: projectId}, (err, projectCategory) => {
				if (err) console.log(err);
				let index = projectCategory.projects.indexOf(projectId);
				projectCategory.projects.splice(index, 1);
				projectCategory.save((err, projectCategory) => {
					if (err) console.log(err);
				})
			});
			
			Project.remove({_id: projectId}, (err, project) => {
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

module.exports = router;