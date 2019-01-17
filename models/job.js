const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
	jobname: String,  // 岗位名称
	requirement: String,  // 岗位要求
	duty: String,  // 岗位职责
	address: String,  // 工作地点
	note: String,  // 备注
	applyWay: String,  // 投递方式
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

JobSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

JobSchema.statics = {
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

module.exports = mongoose.model('Job', JobSchema);