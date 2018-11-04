const express = require('express');
const router = express.Router();
const ApplyUser = require('../../models/applyUser');
const nodeEmailer = require('nodemailer');
const ApplyEmail = require('../../models/applyEmail');

router.post('/admin/software/apply', (req, res) => {
	try {
		let applyObj = req.body.nmist;
		let pattern = /^1[34578]\d{9}$/;
		if (!(pattern.test(applyObj.tel))) {
			let msg = '您的手机号不符合规范,请您检查后重试!';
			return res.redirect(`/admin/status?return_url=/contact&code=0&tips=${msg}`)
		}
		if (applyObj.name && applyObj.tel) {
			// 保存用户软件申请
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
							// 保存成功后往邮箱发送通知邮件
							ApplyEmail.fetch((err, applyEmail) => {
								if (err) console.log(err);
								let email = applyEmail[0].email;
								let transporter = nodeEmailer.createTransport({
									service: '163',
									auth: {
										user: "tccdtest2@163.com",
										pass: "bim123"
									}
								});
								
								let mailOptions = {
									from: "tccdtest2@163.com",
									to: email,
									subject: '软件申请',
									text: "软件申请新通知",
									html: "您好! 有新的软件申请，来自于 <strong>" + applyUser.name + "</strong>，联系方式为: <a href='tel:" + applyUser.tel + "'>" + applyUser.tel + "</a>, 请前往 <a href='http://www.nmist.com/admin/applyList' target='_blank'>天磁信息科技管理后台</a> 查看并处理!"
								};
								
								transporter.sendMail(mailOptions, function (error, info) {
									if (error) {
										console.log(error)
									}
								});
								
								let msg = '软件申请已经收到，工作人员稍后将会电话联系您，感谢您的选择!';
								return res.redirect(`/admin/status?return_url=/contact&code=1&tips=${msg}`)
							});
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