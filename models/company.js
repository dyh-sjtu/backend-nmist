const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
	introduction: String,  // 公司简介
	character: String,  // 公司特征
	imgUrl: String,  // 公司封面图片
	history: String,  // 公司发展历史图片
	address: String, // 公司地址
	email: String,  // 公司邮箱
	qqNumber: String,  // QQ技术交流群
	tel: String, // 业务咨询电话
	wechatQrCode: String, // 企业微信二维码图片
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

CompanySchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

CompanySchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort({'meta.updateAt': -1})
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
};

module.exports = mongoose.model('Company', CompanySchema);