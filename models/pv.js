const mongoose = require('mongoose');
let pvSchema = new mongoose.Schema({
	ip: String,  // 访问者的ip地址
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

// 为模式添加新的方法
pvSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next()
});


pvSchema.statics = {
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

module.exports = mongoose.model("Pv", pvSchema);
