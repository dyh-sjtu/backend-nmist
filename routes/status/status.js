let express = require('express');
let router = express.Router();

router.get('/admin/status', (req, res) => {
	let code = parseInt(req.query.code);
	let tips = req.query.tips;
	let return_url = req.query.return_url;
	res.render("status", {
		tips: tips,
		code: code,
		href: return_url
	})
});

module.exports = router;