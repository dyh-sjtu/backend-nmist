let path = require('path');
let fs = require('fs');

exports.saveFile = (req, res, next) => {
	try {
		let posterData = req.files.file;
		let filePath = posterData.path;
		let originalFilename = posterData.originalFilename;
		if (originalFilename) {
			fs.readFile(filePath, (err, data) => {
				let timestamp = Date.now();
				let typeArr = originalFilename.split('.');
				let type = typeArr[typeArr.length-1];
				let newFile = typeArr.slice(0, typeArr.length-1).join("") + "_" + timestamp + '.' + type;
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
	}catch(err) {
		console.log('err', err)
	}
};