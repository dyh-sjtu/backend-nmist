const express = require('express');
const router = express.Router();
const News = require('../../models/news');
const upload = require('../middleware/upload');
const Software = require('../../models/software');
const Slider = require('../../models/slider');
const Customer = require('../../models/customer');
const Project = require('../../models/project');
const ProjectCategory = require('../../models/projectCategory');
const Product = require('../../models/product');
const Company = require('../../models/company');
const Job = require('../../models/job');


// 所有静态页面
router.get('/', upload.saveViewData, (req, res) => {
	News.find({}).sort({'meta.updateAt': -1}).limit(2).exec((err, news) => {
		Slider.fetch((err, sliders) => {
			Customer.fetch((err, customers) => {
				Product.find({}).limit(6)
					.exec((err, products) => {
						Project.find({}).limit(6)
							.exec((err, projects) => {
								// 需要将客户案例类型分类成三种，1-战略合作 2-BIM咨询公司 3-研究中心合作单位
								let zhanlve_customers = customers.filter((customer, index) => customer.type === 1);
								let BIM_customers = customers.filter((customer, index) => customer.type === 2);
								let researchCenter_customers = customers.filter((customer, index) => customer.type === 3);
								res.render("index", {
									news: news,
									sliders: sliders,
									zhanlve_customers: zhanlve_customers,
									BIM_customers: BIM_customers,
									researchCenter_customers: researchCenter_customers,
									projects: projects,
									products: products
								})
							})
					})
			})
		})
	})
});

router.get('/index', upload.saveViewData, (req, res) => {
	News.find({}).sort({'meta.updateAt': -1}).limit(2).exec((err, news) => {
		Slider.fetch((err, sliders) => {
			Customer.fetch((err, customers) => {
				Product.find({}).limit(6)
					.exec((err, products) => {
						Project.find({}).limit(6)
							.exec((err, projects) => {
								// 需要将客户案例类型分类成三种，1-战略合作 2-BIM咨询公司 3-研究中心合作单位
								let zhanlve_customers = customers.filter((customer, index) => customer.type === 1);
								let BIM_customers = customers.filter((customer, index) => customer.type === 2);
								let researchCenter_customers = customers.filter((customer, index) => customer.type === 3);
								res.render("index", {
									news: news,
									sliders: sliders,
									zhanlve_customers: zhanlve_customers,
									BIM_customers: BIM_customers,
									researchCenter_customers: researchCenter_customers,
									projects: projects,
									products: products
								})
							})
					})
			})
		})
	})
});

router.get('/about', upload.saveViewData, (req, res) => {
	try {
		Company.fetch((err, companys) => {
			res.render("about", {
				company: companys[0]
			})
		})
	} catch (err) {
		console.log('err', err);
	}
})

router.get('/contact', upload.saveViewData, (req, res) => {
	res.render("contact")
});

router.get('/download', upload.saveViewData, (req, res) => {
	try {
		Software.fetch((err, softwares) => {
			res.render("download", {
				softwares: softwares
			})
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/productList', upload.saveViewData, (req, res) => {
	try {
		Product.find({}).exec((err, products) => {
			res.render("product", {
				products: products
			})
		})
	} catch (err) {
		console.log('err', err);
	}
});

router.get('/product/videoType/:id', (req, res) => {
	try {
		let productId = req.params.id;
		if (productId) {
			Product.findById(productId, (err, product) => {
				if (err) console.log(err);
				res.render('productVideo', {
					products: [product]
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
})

router.get('/product/video/all', (req, res) => {
	try {
		Product.find({}).exec((err, products) => {
			if (err) console.log(err);
			res.render('productVideo', {
				products: products
			})
		})
	} catch (err) {
		console.log('err', err);
	}
})

router.get('/product/detail/:id', upload.saveViewData, (req, res) => {
	try {
		let productId = req.params.id;
		if (productId) {
			Product.findById(productId, (err, product) => {
				res.render('productDetail', {
					product: product
				})
			})
		}
	} catch (err) {
		console.log('err', err);
	}
})

router.get('/projectList', upload.saveViewData, (req, res) => {
	ProjectCategory.find({}).exec((err, projectCategorys) => {
		// 需要将客户案例类型分类成三种，1-战略合作 2-BIM咨询公司 3-研究中心合作单位
		res.render("project", {
			projectCategorys: projectCategorys
		})
	})
})

router.get('/project/detail/:id', upload.saveViewData, (req, res) => {
	try {
		let projectId = req.params.id;
		if (projectId) {
			Project.findById(projectId, (err, project) => {
				res.render('projectDetail', {
					projects: [project]
				})
			})
		}
	} catch (err) {
		if (err) console.log('err', err);
	}
});

router.get('/project/category/:id', upload.saveViewData, (req, res) => {
	try {
		let projectCategoryId = req.params.id;
		if (projectCategoryId) {
			Project.find({category: projectCategoryId})
				.exec((err, projects) => {
					res.render('projectDetail', {
						projects: projects
					})
				})
		}
	} catch (err) {
		if (err) console.log('err', err);
	}
})


router.get('/recurit', upload.saveViewData, (req, res) => {
	try {
		Job.find({}).exec((err, jobs) => {
			if (err) console.log(err);
			res.render('recurit', {
				jobs: jobs
			})
		})
	} catch (err) {
		console.log('err', err);
	}
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