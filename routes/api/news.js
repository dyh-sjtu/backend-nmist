const express = require('express');
const router = express.Router();
const Auth = require("../middleware/auth");

router.get('/admin/news', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	
});

module.exports = router;