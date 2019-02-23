const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const Company = require('../../models/company');

// 公司简介
router.get('/admin/company', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Company.fetch((err, companys) => {
			res.render('company', {
				title: '关于天磁',
				localUser: localUser,
				company: companys[0]
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 客户案例信息保存
router.post('/admin/company/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let companyObj = req.body;
		if (companyObj.companyId) {
			Company.findById(companyObj.companyId, (err, company) => {
				let _companyObj = Object.assign(company, companyObj);
				_companyObj.save((err, company) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}else {
			let _companyObj = new Company(companyObj);
			_companyObj.save((err, company) => {
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

router.get('/index/companyInfo', (req, res) => {
	try {
		Company.fetch((err, companys) => {
			if (err) console.log(err);
			return res.json({
				success: 1,
				data: {
					companyInfo: companys[0]
				}
			})
		})
	}catch(err) {
		console.log('err', err);
	}
})

module.exports = router;