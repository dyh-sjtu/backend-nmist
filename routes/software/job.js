const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const Job = require('../../models/job');

// 招聘公告列表
router.get('/admin/jobList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Job.fetch((err, jobs) => {
			res.render('jobList', {
				title: '人才招聘',
				localUser: localUser,
				jobs: jobs
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入招聘公告添加页面
router.get('/admin/job/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("jobAdd", {
			title: '人才招聘',
			localUser: localUser,
			job: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/job/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let jobId = req.params.id;
		let localUser = res.locals.user;
		if (jobId) {
			Job.findById(jobId, (err, job) => {
				res.render('jobAdd', {
					title: '人才招聘',
					localUser: localUser,
					job: job
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 招聘公告信息保存
router.post('/admin/job/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let jobObj = req.body;
		if (jobObj.jobId) {
			Job.findById(jobObj.jobId, (err, job) => {
				let _jobObj = Object.assign(job, jobObj);
				_jobObj.save((err, job) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}else {
			let _jobObj = new Job(jobObj);
			_jobObj.save((err, job) => {
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

// 招聘公告删除
router.delete('/admin/jobList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let jobId = req.query.jobId;
		if (jobId) {
			Job.remove({_id: jobId}, (err, job) => {
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