let mongoose = require('mongoose');
let SoftwareSchema = new mongoose.Schema({
	name: String,
	version: String,
	environment: String,
	lang: String,
	system: String,
	figure: String,
	linkUrl: String,
	baiduyunUrl: String,  // 百度云下载地址
	video: String,
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
SoftwareSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});


// 静态方法
SoftwareSchema.statics = {
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

module.exports = mongoose.model("Software", SoftwareSchema);
