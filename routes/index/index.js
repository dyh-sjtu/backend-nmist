let express = require('express');
let router = express.Router();
let Company = require('../../models/company');
let Category = require('../../models/category');
const Message = require('../../models/message');


router.get('/', (req, res) => {
	let localUser = req.session.user;
	Category.find({})
		.populate('companies')
		.exec((err, categories) => {
			Message.fetch((err, messages) => {
				res.render('index', {
					title: '首页',
					categories: categories,
					localUser: localUser,
					messages: messages
				})
			})
		});
});

// 公司详情
router.get('/tsmsjtu/company/detail/:id', (req, res) => {
	let localUser;
	if (req.session.user) {
		localUser = req.session.user;
	}
	let companyId = req.params.id;
	Company.findOne({_id: companyId})
		.populate("category")
		.exec((err, company) => {
			if (err) {
				console.log(err);
			}
			res.render('companyDetail', {
				title: '公司业态详情',
				company: company,
				localUser: localUser
			})
		})
});

// 搜索业态公司名称或者行业名称
router.get('/tsmsjtu/search', (req, res) => {
	let localUser;
	if (req.session.user) {
		localUser = req.session.user;
	}
	let totalSize = 0;
	let query = req.query.query;
	let reg = new RegExp(query + '.*', 'i');
	Company.find({name: reg})
		.populate('category', 'name')
		.exec((err, companies) => {
			if (companies.length <= 0) {
				Category.find({name: reg})
					.populate('companies')
					.exec((err, categories) => {
						if (categories && categories.length > 0) {
							categories.forEach((item, index) => {
								totalSize += item.companies.length;
							});
							res.render('search', {
								title: '业态搜索',
								number: totalSize,
								categories: categories,
								localUser: localUser,
								keywords: query
							})
						} else {
							res.render('search', {
								title: '业态搜索',
								empty: true
							})
						}
					})
			} else {
				res.render('search', {
					title: '业态搜索',
					number: companies.length,
					keywords: query,
					localUser: localUser,
					companies: companies
				})
			}
		})
});

module.exports = router;