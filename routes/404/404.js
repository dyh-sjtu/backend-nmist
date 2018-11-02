const express = require('express');
const router = express.Router();

router.get('*', (req, res) => {
	res.render('404', {
		title: '404 NOT FOUND'
	})
});

module.exports = router;