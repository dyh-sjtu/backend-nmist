const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const Slider = require('../../models/slider');



// 轮播图列表
router.get('/admin/sliderList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Slider.fetch((err, sliders) => {
			res.render('sliderList', {
				title: '轮播组图',
				localUser: localUser,
				sliders: sliders
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入轮播图添加页面
router.get('/admin/slider/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("sliderAdd", {
			title: '轮播组图',
			localUser: localUser,
			slider: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/slider/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let sliderId = req.params.id;
		let localUser = res.locals.user;
		if (sliderId) {
			Slider.findById(sliderId, (err, slider) => {
				res.render('sliderAdd', {
					title: '软件列表',
					localUser: localUser,
					slider: slider
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 轮播图信息保存
router.post('/admin/slider/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let sliderObj = req.body;
		if (sliderObj.sliderId) {
			Slider.findById(sliderObj.sliderId, (err, slider) => {
				let _sliderObj = Object.assign(slider, sliderObj);
				_sliderObj.save((err, slider) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}else {
			let _sliderObj = new Slider(sliderObj);
			_sliderObj.save((err, slider) => {
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

// 轮播图删除
router.delete('/admin/sliderList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let sliderId = req.query.sliderId;
		if (sliderId) {
			Slider.remove({_id: sliderId}, (err, slider) => {
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