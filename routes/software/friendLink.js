const express = require('express');
const router = express.Router();
const Auth = require('../middleware/auth');
const FriendLink = require('../../models/friendLink');

// 友情链接列表
router.get('/admin/friendLinkList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		FriendLink.fetch((err, friendLinks) => {
			res.render('friendLinkList', {
				title: '友情链接',
				localUser: localUser,
				friendLinks: friendLinks
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入友情链接添加页面
router.get('/admin/friendLink/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("friendLinkAdd", {
			title: '友情链接',
			localUser: localUser,
			friendLink: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/friendLink/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let friendLinkId = req.params.id;
		let localUser = res.locals.user;
		if (friendLinkId) {
			FriendLink.findById(friendLinkId, (err, friendLink) => {
				res.render('friendLinkAdd', {
					title: '友情链接',
					localUser: localUser,
					friendLink: friendLink
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 友情链接信息保存
router.post('/admin/friendLink/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let friendLinkObj = req.body;
		if (friendLinkObj.friendLinkId) {
			FriendLink.findById(friendLinkObj.friendLinkId, (err, friendLink) => {
				let _friendLinkObj = Object.assign(friendLink, friendLinkObj);
				_friendLinkObj.save((err, friendLink) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		} else {
			let _friendLinkObj = new FriendLink(friendLinkObj);
			_friendLinkObj.save((err, friendLink) => {
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
router.delete('/admin/friendLinkList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let friendLinkId = req.query.friendLinkId;
		if (friendLinkId) {
			FriendLink.remove({_id: friendLinkId}, (err, friendLink) => {
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


router.get('/index/friendLink', (req, res) => {
	try {
		FriendLink.fetch((err, friendLinks) => {
			if (err) console.log(err);
			return res.json({
				success: 1,
				data: {
					friendLinks: friendLinks
				}
			})
		})
	} catch (err) {
		console.log('err', err);
	}
})

module.exports = router;