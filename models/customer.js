let mongoose = require('mongoose');
let CustomerSchema = new mongoose.Schema({
	title: String,
	type: Number,  // 1-战略合作  2-BIM咨询公司 3-研究中心合作单位
	src: String,  // 图片的地址
	url: String, // 网站链接的地址
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

// 保存用户及密码比对
CustomerSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});


// 静态方法
CustomerSchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort({'meta.updateAt':-1})
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
};

module.exports = mongoose.model("Customer", CustomerSchema);
