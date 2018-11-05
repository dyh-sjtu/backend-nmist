const express = require('express');
const router = express.Router();
const Auth = require("../middleware/auth");
const Upload = require('../middleware/upload');
const News = require('../../models/news');

router.get('/admin/newsList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		News.fetch((err, newsList) => {
			res.render("newsList", {
				title: '新闻列表',
				localUser: localUser,
				newsList: newsList
			})
		})
	} catch (err) {
		console.log("err", err)
	}
});

// 新闻添加页面
router.get('/admin/news/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("newsAdd", {
			title: '新闻列表',
			localUser: localUser,
			news: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

// 上传图片
router.post('/admin/news/image/upload', Auth.requiredLogin, Auth.requiredAdmin, Upload.saveFile, (req, res) => {
	try {
		if (req.image) {
			return res.json({
				code: 0,
				data: {
					src: req.image
				}
			})
		}else {
			return res.json({
				code: 1,
				msg: "上传失败,请重试",
			})
		}
	}catch (err) {
		console.log('err', err);
	}
});

router.post('/admin/news/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let newsObj = req.body;
		if (newsObj.title) {
			if (newsObj.newsId) {
				News.findById(newsObj.newsId, (err, news) => {
					let _newsObj = Object.assign(news, newsObj);
					_newsObj.save((err, news) => {
						if (err) console.log(err);
						return res.json({
							success: 1
						})
					})
				})
			}else {
				let _newsObj = new News({
					title: newsObj.title,
					content: newsObj.content
				});
				_newsObj.save((err, news) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			}
		}
	}catch(err) {
		console.log('err', err);
	}
})

// 删除新闻
router.delete('/admin/newsList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let newsId = req.query.newsId;
		if (newsId) {
			News.remove({_id: newsId}, (err, news) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	}catch (err) {
		console.log('err', err)
	}
})

router.get('/admin/news/detail/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let newsId = req.params.id;
		let localUser = res.locals.user;
		if (newsId) {
			News.findById(newsId, (err, news) => {
				res.render('newsDetail', {
					title:'新闻列表',
					localUser: localUser,
					news: news
				})
			})
		}
	}catch(err) {
		console.log('err', err);
	}
})

router.get('/admin/news/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let newsId = req.params.id;
		let localUser = res.locals.user;
		if (newsId) {
			News.findById(newsId, (err, news) => {
				res.render('newsAdd', {
					title: '新闻列表',
					localUser: localUser,
					news: news
				})
			})
		}
	}catch(err) {
		console.log('err', err);
	}
})

module.exports = router;