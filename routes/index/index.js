const express = require('express');
const router = express.Router();
const News = require('../../models/news');
const upload = require('../middleware/upload');
const Software = require('../../models/software');
const Slider = require('../../models/slider');
const Customer = require('../../models/customer');


// 所有静态页面
router.get('/', upload.saveViewData, (req, res) => {
	News.find({}).limit(2).exec((err, news) => {
		Slider.fetch((err, sliders) => {
			Customer.fetch((err, customers) => {
				// 需要将客户案例类型分类成三种，1-战略合作 2-BIM咨询公司 3-研究中心合作单位
				let zhanlve_customers = customers.filter((customer, index) => customer.type === 1);
				let BIM_customers = customers.filter((customer, index) => customer.type === 2);
				let researchCenter_customers = customers.filter((customer, index) => customer.type === 3);
				res.render("index", {
					news: news,
					sliders: sliders,
					zhanlve_customers: zhanlve_customers,
					BIM_customers: BIM_customers,
					researchCenter_customers: researchCenter_customers
				})
			})
		})
	})
});

router.get('/index', upload.saveViewData, (req, res) => {
	News.find({}).limit(2).exec((err, news) => {
		Slider.fetch((err, sliders) => {
			Customer.fetch((err, customers) => {
				// 需要将客户案例类型分类成三种，1-战略合作 2-BIM咨询公司 3-研究中心合作单位
				let zhanlve_customers = customers.filter((customer, index) => customer.type === 1);
				let BIM_customers = customers.filter((customer, index) => customer.type === 2);
				let researchCenter_customers = customers.filter((customer, index) => customer.type === 3);
				res.render("index", {
					news: news,
					sliders: sliders,
					zhanlve_customers: zhanlve_customers,
					BIM_customers: BIM_customers,
					researchCenter_customers: researchCenter_customers
				})
			})
		})
	})
});

router.get('/about', upload.saveViewData, (req, res) => {
	res.render("about")
})

router.get('/example', upload.saveViewData, (req, res) => {
	res.render("example")
})

router.get('/contact', upload.saveViewData, (req, res) => {
	res.render("contact")
})

router.get('/download', upload.saveViewData, (req, res) => {
	Software.fetch((err, softwares) => {
		res.render("download", {
			softwares: softwares
		})
	})
})

router.get('/product', upload.saveViewData, (req, res) => {
	res.render("product")
})

router.get('/useage', upload.saveViewData, (req, res) => {
	res.render("useage")
})

router.get('/NMCAD', upload.saveViewData, (req, res) => {
	res.render("nmcad")
})

router.get('/NMBIM', upload.saveViewData, (req, res) => {
	res.render("nmbim")
})

router.get('/NMGIS', upload.saveViewData, (req, res) => {
	res.render("nmgis")
});

router.get('/recurit', upload.saveViewData, (req, res) => {
	res.render("recurit")
});

router.get('/agent', upload.saveViewData, (req, res) => {
	res.render("agent")
});

router.get('/resume', upload.saveViewData, (req, res) => {
	try {
		let jobname = req.query.jobname;
		if (jobname) {
			res.render('resume', {
				jobname: jobname
			})
		}
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/news', upload.saveViewData, (req, res) => {
	try {
		News.fetch((err, news) => {
			res.render('news', {
				news: news
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

router.get('/news/:id', upload.saveViewData, (req, res) => {
	try {
		let newsId = req.params.id;
		News.findById(newsId, (err, newsItem) => {
			res.render('newsItem', {
				newsItem: newsItem
			})
		})
	} catch (err) {
		console.log('err', err)
	}
});

module.exports = router;