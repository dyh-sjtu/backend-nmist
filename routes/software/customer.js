const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const Customer = require('../../models/customer');

// 客户案例列表
router.get('/admin/customerList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		let pageIndex = parseInt(Object.keys(req.query).length > 0 && req.query.pageIndex) || 0;
		let pageSize = 8;
		Customer.find({}).sort({'meta.createAt': -1}).limit(pageSize).skip(pageIndex * pageSize).exec((err, customers) => {
			Customer.count().exec((err, customerNum) => {
				res.render("customerList", {
					title: '客户案例',
					localUser: localUser,
					customers: customers,
					pageSize: pageSize,
					pageIndex: pageIndex,
					totalPage: Math.ceil(customerNum / pageSize)
				})
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

// 进入客户案例添加页面
router.get('/admin/customer/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("customerAdd", {
			title: '客户案例',
			localUser: localUser,
			customer: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/customer/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let customerId = req.params.id;
		let localUser = res.locals.user;
		if (customerId) {
			Customer.findById(customerId, (err, customer) => {
				res.render('customerAdd', {
					title: '客户案例',
					localUser: localUser,
					customer: customer
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 客户案例信息保存
router.post('/admin/customer/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let customerObj = req.body;
		if (customerObj.customerId) {
			Customer.findById(customerObj.customerId, (err, customer) => {
				let _customerObj = Object.assign(customer, customerObj);
				_customerObj.save((err, customer) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		} else {
			let _customerObj = new Customer(customerObj);
			_customerObj.save((err, customer) => {
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
router.delete('/admin/customerList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let customerId = req.query.customerId;
		if (customerId) {
			Customer.remove({_id: customerId}, (err, customer) => {
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

// // 获取总记录条数
// router.get('/admin/customerList/count', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
// 	try {
// 		Customer.count().exec((err, num) => {
// 			if (err) console.log(err);
// 			return res.json({
// 				success: 1,
// 				data: {
// 					countNumber: num
// 				}
// 			})
// 		})
// 	} catch (err) {
// 		console.log('err', err);
// 	}
// });

module.exports = router;