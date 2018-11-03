const express = require('express');
const router = express.Router();
const ApplyUser = require('../../models/applyUser');

router.post('/admin/software/apply', (req, res) => {
	try {
		let applyObj = req.body.nmist;
		let pattern = /^1[34578]\d{9}$/;
		if (!(pattern.test(applyObj.tel))) {
			let msg = '您的手机号不符合规范,请您检查后重试!';
			return res.redirect(`/admin/status?return_url=/contact&code=0&tips=${msg}`)
		}
		if (applyObj.name && applyObj.tel) {
			ApplyUser.findOne({tel: applyObj.tel}, (err, applyUser) => {
				if (err) console.log(err);
				if (applyUser) {
					let msg = '您的手机号已经申请过了，请更换手机号重试!';
					return res.redirect(`/admin/status?return_url=/contact&code=0&tips=${msg}`)
				} else {
					let _applyUser = new ApplyUser(applyObj);
					_applyUser.save((err, applyUser) => {
						if (err) console.log(err);
						if (applyUser) {
							let msg = '软件申请已经收到，工作人员稍后将会电话联系您，感谢您的选择!';
							return res.redirect(`/admin/status?return_url=/contact&code=1&tips=${msg}`)
						}
					})
				}
			})
		}
	} catch (err) {
		console.log('err', err)
	}
});

module.exports = router;