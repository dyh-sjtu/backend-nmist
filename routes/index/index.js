const express = require('express');
const router = express.Router();


// 所有静态页面
router.get('/', (req, res) => {
	res.render("index")
});

router.get('/index', (req, res) => {
	res.render("index");
});

router.get('/about', (req, res) => {
	res.render("about")
})

router.get('/example', (req, res) => {
	res.render("example")
})

router.get('/contact', (req, res) => {
	res.render("contact")
})

router.get('/news', (req, res) => {
	res.render("news")
})

router.get('/download', (req, res) => {
	res.render("download")
})

router.get('/product', (req, res) => {
	res.render("product")
})

router.get('/useage', (req, res) => {
	res.render("useage")
})

router.get('/NMCAD', (req, res) => {
	res.render("nmcad")
})

router.get('/NMBIM', (req, res) => {
	res.render("nmbim")
})

router.get('/NMGIS', (req, res) => {
	res.render("nmgis")
})

// 查看新闻详情
router.get('/news/:id', (req, res) => {
	try {
		let newsId = req.params.id;
	}catch(err) {
		console.log('err', err)
	}
});

module.exports = router;