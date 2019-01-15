const express = require('express');
const router = express.Router();
const Pv = require('../../models/pv');
const Auth = require("../middleware/auth");
const moment = require('moment');


router.get('/admin/viewAnalysis', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Pv.fetch((err, allPvs) => {
			// allPvs为访问总数
			// allIps为访问的独立ip总数
			let ipHasRepeat = [];
			allPvs.forEach((pv, index) => {
				if (ipHasRepeat.indexOf(pv.ip) === -1) {
					ipHasRepeat.push(pv.ip);
				}
			});
			res.render('viewList', {
				title: "访问统计",
				localUser: localUser,
				allPvs: allPvs,
				allIps: ipHasRepeat,
			})
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/viewAnalysis/search', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let timeStart;
	}catch(err) {
		console.log('err', err);
	}
});


router.post('/admin/viewData/day', Auth.requiredAdmin, Auth.requiredLogin, (req, res) => {
	try {
		let day = req.body.day;
		Pv.find({
			"$and": [{"meta.createAt": {"$gt": moment(day)}},
				{"meta.createAt": {"$lte": moment(day).add(24, 'hours')}}]
		})
			.exec((err, pvs) => {
				return res.json({
					success: 1,
					data: {
						pvs: pvs
					}
				})
			})
	} catch (err) {
		console.log('err', err);
	}
});

router.post('/admin/viewData/month', Auth.requiredAdmin, Auth.requiredLogin, (req, res) => {
	try {
		let month = req.body.month;
		Pv.find({
			"$and": [{"meta.createAt": {"$gt": moment(month)}},
				{"meta.createAt": {"$lte": moment(month).add(1, 'month')}}]
		})
			.exec((err, pvs) => {
				return res.json({
					success: 1,
					data: {
						pvs: pvs
					}
				})
			})
	} catch (err) {
		console.log('err', err);
	}
});

router.post('/admin/viewData/year', Auth.requiredAdmin, Auth.requiredLogin, (req, res) => {
	try {
		let year = req.body.year;
		Pv.find({
			"$and": [{"meta.createAt": {"$gt": moment(year)}},
				{"meta.createAt": {"$lte": moment(year).add(1, 'year')}}]
		})
			.exec((err, pvs) => {
				return res.json({
					success: 1,
					data: {
						pvs: pvs
					}
				})
			})
	} catch (err) {
		console.log('err', err);
	}
});


module.exports = router;