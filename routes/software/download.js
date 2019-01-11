const express = require('express');
const router = express.Router();
const Software = require('../../models/software');
const Auth = require('../middleware/auth');
const Upload = require('../middleware/upload');
const DownloadInfo = require('../../models/downloadInfo');

// 软件列表
router.get('/admin/softwareList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		Software.fetch((err, softwares) => {
			res.render('softwareList', {
				title: '软件列表',
				localUser: localUser,
				softwares: softwares
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

// 进入软件添加页面
router.get('/admin/software/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		res.render("softwareAdd", {
			title: '软件列表',
			localUser: localUser,
			software: ''
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/admin/software/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let softwareId = req.params.id;
		let localUser = res.locals.user;
		if (softwareId) {
			Software.findById(softwareId, (err, software) => {
				res.render('softwareAdd', {
					title: '软件列表',
					localUser: localUser,
					software: software
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

// 软件信息保存
router.post('/admin/software/save', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let softwareObj = req.body;
		if (softwareObj.softwareId) {
			Software.findById(softwareObj.softwareId, (err, software) => {
				let _softwareObj = Object.assign(software, softwareObj);
				_softwareObj.save((err, software) => {
					if (err) console.log(err);
					return res.json({
						success: 1
					})
				})
			})
		}else {
			let _softwareObj = new Software(softwareObj);
			_softwareObj.save((err, software) => {
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

// 软件删除
router.delete('/admin/softwareList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let softwareId = req.query.softwareId;
		if (softwareId) {
			Software.remove({_id: softwareId}, (err, software) => {
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

// 上传图片
// router.post('/admin/software/image/upload', Auth.requiredLogin, Auth.requiredAdmin, Upload.saveFileWithNoTimestamp, (req, res) => {
// 	try {
// 		if (req.newFile) {
// 			return res.json({
// 				code: 0,
// 				data: {
// 					src: req.newFile
// 				}
// 			})
// 		}else {
// 			return res.json({
// 				code: 1,
// 				msg: "上传图片失败,请重试",
// 			})
// 		}
// 	}catch (err) {
// 		console.log('err', err);
// 	}
// });

// 上传软件
// router.post('/admin/software/file/upload', Auth.requiredLogin, Auth.requiredAdmin, Upload.saveFileWithNoTimestamp, (req, res) => {
// 	try {
// 		if (req.newFile) {
// 			return res.json({
// 				code: 0,
// 				data: {
// 					src: req.newFile
// 				}
// 			})
// 		}else {
// 			return res.json({
// 				code: 1,
// 				msg: "上传软件失败,请重试",
// 			})
// 		}
// 	}catch (err) {
// 		console.log('err', err);
// 	}
// });


router.post('/admin/download/count', (req, res) => {
	try {
		let downloadInfo = req.body;
		if (downloadInfo.ip && downloadInfo.address && downloadInfo.softwareName && Object.keys(downloadInfo).length === 4) {
			let _downloadInfoObj = new DownloadInfo({
				softwareName: downloadInfo.softwareName,
				ip: downloadInfo.ip,
				address: downloadInfo.address,
				downloadWay: parseInt(downloadInfo.downloadWay),
			});
			_downloadInfoObj.save((err, downloadInfo) => {
				if (err) console.log(err);
				return res.json({
					success: 1
				})
			})
		}
	}catch(err) {
		console.log('err', err);
	}
});


router.get('/admin/downloadInfoList', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let localUser = res.locals.user;
		DownloadInfo.fetch((err, downloadInfos) => {
			res.render('downloadInfoList', {
				title: '下载统计',
				localUser: localUser,
				downloadInfos: downloadInfos
			})
		});
	} catch (err) {
		console.log('err', err)
	}
});

router.delete('/admin/downloadInfoList/del', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let downloadInfoId = req.query.downloadInfoId;
		if (downloadInfoId) {
			DownloadInfo.remove({_id: downloadInfoId}, (err, downloadInfo) => {
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

router.get('/admin/downloadInfo/search', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	try {
		let keyword = req.query.keyword;
		let pattern = new RegExp(keyword, 'ig');
		if (keyword) {
			DownloadInfo.find({$or:[{softwareName: pattern},{address: pattern}]}, (err, downloadInfos) => {
				if (err) console.log(err);
				res.render('downloadInfoList', {
					title: '下载统计',
					localUser: localUser,
					downloadInfos: downloadInfos
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});




module.exports = router;