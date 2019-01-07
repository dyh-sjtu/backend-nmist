let path = require('path');
let fs = require('fs');
const Pv = require('../../models/pv');

exports.saveFile = (req, res, next) => {
	try {
		let posterData = req.files.file;
		let filePath = posterData.path;
		let originalFilename = posterData.originalFilename;
		if (originalFilename) {
			fs.readFile(filePath, (err, data) => {
				let timestamp = Date.now();
				let typeArr = originalFilename.split('.');
				let type = typeArr[typeArr.length - 1];
				let newFile = typeArr.slice(0, typeArr.length - 1).join(".") + "_" + timestamp + '.' + type;
				let newPath = path.join(__dirname, '../../', '/public/uploads/' + newFile);
				fs.writeFile(newPath, data, (err, data) => {
					req.newFile = "/uploads/" + newFile;
					req.filename = originalFilename;
					next();
				})
			})
		} else {
			next();
		}
	} catch (err) {
		console.log('err', err)
	}
};

exports.saveFileWithNoTimestamp = (req, res, next) => {
	try {
		let posterData = req.files.file;
		let filePath = posterData.path;
		let originalFilename = posterData.originalFilename;
		if (originalFilename) {
			fs.readFile(filePath, (err, data) => {
				let newPath = path.join(__dirname, '../../', '/public/uploads/' + originalFilename);
				fs.writeFile(newPath, data, (err, data) => {
					req.newFile = "/uploads/" + originalFilename;
					req.filename = originalFilename;
					next();
				})
			})
		} else {
			next();
		}
	} catch (err) {
		console.log('err', err)
	}
};


exports.saveViewData = (req, res, next) => {
	try {
		let ip = req.headers['x-real-ip'] || req.headers['x-forward-for'] || req.headers['clientip'] || '127.0.0.1';
		let realIp = ip && ip.split(',')[0];
		if (realIp) {
			let _pvObj = new Pv({
				ip: realIp
			});
			_pvObj.save((err, pv) => {
				if (err) console.log(err);
				next();
			})
		} else {
			next();
		}
	} catch (err) {
		console.log('err', err)
	}
};