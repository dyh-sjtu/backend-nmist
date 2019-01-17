const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
	name: String,  // 英文名称
	cnName: String,  // 中文名称
	desc: String,
	icon: String,  // 产品图标
	imgUrl: String,  // 产品封面图片地址
	summary: String,  // 平台概述
	character: String,  // 平台特征
	advantage: String,  // 平台优势
	training: String,  // 平台背景
	video: String,  // 视频相关信息
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

ProductSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

ProductSchema.statics = {
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

module.exports = mongoose.model('Product', ProductSchema);