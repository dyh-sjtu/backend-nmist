const express = require('express');
const router = express.Router();

router.get('*', (req, res) => {
	res.render('404', {
		msg: "您要的页面不见啦，请重新返回首页重试!",
	})
});

module.exports = router;