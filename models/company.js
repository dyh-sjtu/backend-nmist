let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
let CompanySchema = new mongoose.Schema({
	name: String,  // 公司名称
	addr: String,  // 公司地址
	note: String,  // 关于公司模板的说明
	category: {
		type: ObjectId,
		ref: "Category"
	},
	judgeType: {
		type: String,
		default: 0
	},
	uploadUrl: String,  // 用户上传的excel链接
	risks: [
		{
			number: Number,  // 风险编号 从0开始编号
			title: String,  // 风险名称
			isL: Number,  // 风险因子L
			isE: Number,  // 风险因子E
			isC: Number,  // 风险因子C
			isD: Number,  // 风险评价D
			rank: String,  // 风险等级
			measure: String,  // 采取措施
			isImportant: {  // 是否为重大风险
				type: Boolean,
				default: false
			}
		}
	],
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
CompanySchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next()
});

CompanySchema.statics = {
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

module.exports = mongoose.model("Company", CompanySchema);
