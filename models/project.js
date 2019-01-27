let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
let ProjectSchema = new mongoose.Schema({
	title: String,  // 项目名称
	category: {
		type: ObjectId,
		ref: 'ProjectCategory'
	},
	imgUrl: String,  // 项目图片
	company: String,  // 项目公司
	comment: String,  // 客户评价
	linkUrl: String,  // 项目链接
	commentFrom: String,  // 评价客户
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

ProjectSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});


// 静态方法
ProjectSchema.statics = {
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

module.exports = mongoose.model("Project", ProjectSchema);
