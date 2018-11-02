let express = require('express');
let router = express.Router();
let Company = require('../../models/company');
let Category = require('../../models/category');
let readExcel = require('../middleware/excel');
// 权限中间件
let Auth = require('../middleware/auth');
let XLSX = require('node-xlsx');  // 读取excel文件数据转化为json数据存储到数据库

// 挂载至 /xx/xx的中间件，任何指向 /xx/xx 的请求都会执行它
router.get('/tsmsjtu/company/add', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	Category.find({})
		.exec((err, categories) => {
			if (err) {
				console.log(err)
			}
			res.render('companyAdd', {
				title: "公司业态录入页",
				categories: categories,
				company: {
					name: '',
					addr: '',
				}
			})
		});
});


// 公司详情页
router.get('/tsmsjtu/company/update/:id', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	let id = req.params.id;
	if (id) {
		Company.findById(id, (err, company) => {
			Category.find({})
				.exec((err, categories) => {
				res.render('companyAdd', {
					title: '公司详情更新页',
					company: company,
					categories: categories
				})
			})
		})
	}
});

// 保存公司风险信息
router.post('/tsmsjtu/company/save', Auth.requiredLogin, Auth.requiredAdmin, readExcel.readExcel, (req, res) => {
	try{
		let companyObj = req.body.company;
		let companyId = req.body.company._id;
		if (req.excel) {
			companyObj.uploadUrl = req.excel.split('/')[req.excel.split('/').length-1];
			companyObj.risks = saveData(req.excel);
		}
		if (companyId) {
			Company.findById(companyId, (err, company) => {
				if (err) {
					console.log(err);
				}
				let _companyObj = Object.assign(company, companyObj);
				_companyObj.save((err, company) => {
					if (err) {
						console.log(err);
					}
					
					// 将当前公司类别存入行业类别中
					Category.findById(company.category, (err, category) => {
						if (category.companies.indexOf(company._id) > -1) {
							return;
						} else {
							category.companies.push(company._id);
							category.save((err, category) => {
								if (err) {
									console.log(err);
								}
							})
						}
					});
					
					// 将修改类别之前公司所在类别删除掉
					Category.findOne({companies: companyId}, (err, category) => {
						if (category.companies && category.companies.length > 0) {
							category.companies.filter((item, index) => {
								return item.toString() !== companyId.toString();
							})
						}
						category.save((err, category) => {
							if (err) {
								console.log(err);
							}
						})
					});
					res.redirect('/tsmsjtu/company/list');
				})
			})
		} else {
			let _companyObj = new Company(companyObj);
			if (_companyObj.category) {
				_companyObj.save((err, company) => {
					if (err) {
						console.log(err);
					}
					Category.findById(company.category, (err, category) => {
						if (err) {
							console.log(err);
						}
						category.companies.push(company._id);
						category.save((err, category) => {
							if (err) {
								console.log(err);
							}
						})
					});
					res.redirect('/tsmsjtu/company/list');
				})
			}else {
				let msg = "请选择行业类别, 否则无法保存";
				res.redirect(`/tsmsjtu/status?return_url=/tsmsjtu/company/add&code=0&tips=${msg}`);
			}
		}
	}catch(err) {
		console.log('err', err)
	}
});

// 公司详情列表
router.get('/tsmsjtu/company/list', Auth.requiredLogin, Auth.requiredAdmin, (req, res) => {
	Company.find({})
		.populate('category')
		.exec((err, companies) => {
			if (err) {
				console.log(err);
			}
			res.render('companyList', {
				title: '公司风险详情列表',
				companies: companies
			})
		})
});


// 业态删除
router.delete('/tsmsjtu/company/list/del',Auth.requiredLogin,  Auth.requiredAdmin, (req, res) => {
	let id = req.query.id;
	if (id) {
		Category.findOne({companies: id}, (err, category) => {
			if (err) {
				console.log(err);
			}
			let index = category.companies.indexOf(id);
			category.companies.splice(index, 1);
			category.save((err, category) => {
				if (err) {
					console.log(err);
				}
			})
		});
		Company.remove({_id: id}, (err, company) => {
			if (err) {
				console.log(err)
			} else {
				return res.json({
					success: 1
				})
			}
		})
	}
});

/**
 * 存储excel数据的方法
 * @param excel
 * @returns {Array}
 */
function saveData(excel) {
	let workbook = XLSX.parse(excel);
	if(!workbook || !workbook[0]) return;
	let data = workbook[0].data;
	let len = data && data.length;
	if (!len || len <= 2) return;
	let risks = [];
	for (let i = 1; i < len; i++) {
		let riskObj = {};
		if (data[i] && !data[i][8]) {
			data[i][8] = data[i - 1][8];
		}
		riskObj.number = data[i][0];
		riskObj.title = data[i][1];
		riskObj.isL = data[i][2];
		riskObj.isE = data[i][3];
		riskObj.isC = data[i][4];
		riskObj.isD = data[i][5];
		riskObj.rank = data[i][6];
		riskObj.isImportant = data[i][7] === '是' ? true : (data[i][7] === '否' ? false : '');
		riskObj.measure = data[i][8];
		if (isNotEmpty(riskObj)) risks.push(riskObj);
	}
	return risks;
}

function isNotEmpty(obj) {
	return obj.title && obj.isL && obj.isE && obj.isC && obj.isD && obj.rank;
}

module.exports = router;