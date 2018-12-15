const express = require('express');
const router = express.Router();

router.get('/admin/viewAnalysis', (req, res) => {
	let localUser = res.locals.user;
	res.render('viewList', {
		title: "访问统计",
		localUser: localUser
	})
})

module.exports = router;