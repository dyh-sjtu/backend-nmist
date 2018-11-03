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
	// role: 1 访客 // 无任何权限
	// role: 7 超级管理员权限
	role: {
		type: Number,
		default: 1
	},
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
