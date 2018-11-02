let path = require('path');
let fs = require('fs');

exports.saveFile = (req, res, next) => {
	try {
		let posterData = req.files.uploadPic;
		let filePath = posterData.path;
		let originalFilename = posterData.originalFilename;
		if (originalFilename) {
			fs.readFile(filePath, (err, data) => {
				let timestamp = Date.now();
				let type = posterData.type.split('/')[1];
				let newImage = timestamp + '.' + type;
				let newPath = path.join(__dirname, '../../', '/public/uploads/' + newImage)
				fs.writeFile(newPath, data, (err, data) => {
					req.image = newImage;
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