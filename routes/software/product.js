const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const Product = require('../../models/product');

// 产品列表
router.get('/admin/productList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Product.fetch((err, products) => {
			res.render('productList', {
				title: '产品介绍',
				localUser: localUser,
				products: products
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入产品添加页面
router.get('/admin/product/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("productAdd", {
			title: '产品介绍',
			localUser: localUser,
			product: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/product/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productId = req.params.id;
		let localUser = res.locals.user;
		if (productId) {
			Product.findById(productId, (err, product) => {
				res.render('productAdd', {
					title: '产品介绍',
					localUser: localUser,
					product: product
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 客户案例信息保存
router.post('/admin/product/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productObj = req.body;
		if (productObj.productId) {
			Product.findById(productObj.productId, (err, product) => {
				let _productObj = Object.assign(product, productObj);
				_productObj.save((err, product) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		} else {
			let _productObj = new Product(productObj);
			_productObj.save((err, product) => {
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
router.delete('/admin/productList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let productId = req.query.productId;
		if (productId) {
			Product.remove({_id: productId}, (err, product) => {
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


router.get('/index/product', (req, res) => {
	try {
		Product.find({}).exec((err, products) => {
			if (err) console.log(err);
			return res.json({
				success: 1,
				data: {
					products: products
				}
			})
		})
	} catch (err) {
		console.log('err', err);
	}
})


module.exports = router;