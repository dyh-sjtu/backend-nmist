let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 10;
let UserSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	password: {
		type: String,
		unique: true
	},
	// role: 1 访客 // 无任何权限，只能查看首页
	// role: 2 公司权限  // 只能查看首页和自己公司的详情
	// role: 4 部门行业权限 // 只能查看首页和本行业下所有的公司详情
	// role: 6 部分行业权限，可观看部分行业下所有excel
	// role: 7 超级管理员权限
	role: {
		type: Number,
		default: 1
	},
	company:String,  // 用户的公司
	department: String,  // 用户的行业
	partDepartment: [String],  // 只有当用户的权限为6时数组长度才不为0
	sex: {
		type: String,
		default: '男'
	},
	img: {
		type: String,
		default: 'headpic.png'
	},
	email: String,
	tel: Number,
	firstSave: {
		type: Boolean,
		default: false
	},
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
UserSchema.pre('save', function (next) {
	let user = this;
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	if (this.firstSave) {
		bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, null, null, function (err, hash) {
				if (err) {
					return next(err)
				}
				user.password = hash;
				next()
			})
		})
	} else {
		next();
	}
});

// 实例方法：
UserSchema.methods = {
	comparePassword: function (_password, cb) {
		let hash = this.password;
		let isMatch = bcrypt.compareSync(_password, hash);
		cb(null, isMatch);
	}
};

// 静态方法
UserSchema.statics = {
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

module.exports = mongoose.model("User", UserSchema);
