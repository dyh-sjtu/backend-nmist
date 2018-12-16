const express = require('express');
const router = express.Router();
const Pv = require('../../models/pv');
const Auth = require("../middleware/auth");
const moment = require('moment');


router.get('/admin/viewAnalysis', (req, res) => {
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
});


router.post('/admin/viewData', Auth.requiredAdmin, Auth.requiredLogin, (req, res) => {
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
						pvs:pvs
					}
				})
			})
	}catch(err) {
		console.log('err', err);
	}
});


module.exports = router;