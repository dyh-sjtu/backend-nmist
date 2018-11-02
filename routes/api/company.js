let express = require('express');
let router = express.Router();
let Category = require('../../models/category');
let Company = require('../../models/company');
let Auth = require('../middleware/auth');
let XLSX = require('node-xlsx');
let fs = require('fs');
let AppUser = require('../../models/app-user');
let Report = require('../../models/report');
const TemporaryReport = require('../../models/temporary-report');
let path = require('path');


// 获得行业类别下的公司详情
router.get('/tsmsjtu/companyInfo', Auth.requiredToken, (req, res) => {
	let companyId = req.query.companyId;
	Company.findOne({_id: companyId})
		.populate('category')
		.exec((err, company) => {
			if (err) {
				return res.json({
					success: 0,
					data: {}
				})
			}
			if (company) {
				return res.json({
					success: 1,
					data: company
				})
			}
		})
});


// 获得所有行业类别
router.get('/tsmsjtu/company/categories', Auth.requiredToken, (req, res) => {
	Category.find({})
		.populate('companies', 'name')
		.exec((err, categories) => {
			if (err) {
				return res.json({
					success: 0,
					data: {}
				})
			}
			if (categories) {
				return res.json({
					success: 1,
					data: categories
				})
			}
		})
});

// 保存并生成excel
router.post('/tsmsjtu/report/save', Auth.requiredToken, (req, res) => {
	try {
		let userInfo = req.userInfo;
		let username = userInfo.data.split('&')[2].split('=')[1];
		let reportData = req.body;
		let appUserId = req.userInfo.data.split('&')[1].split('=')[1];
		let report = [
			{
				name: new Date().getTime().toString(),
				data: [
					[
						'报告人', '联系方式', '评估地址', '评估时间', '企业模板名称', '模板所属行业'
					],
					[
						reportData.reportPerson, reportData.tel, reportData.address, reportData.reportTime, reportData.companyName, reportData.categoryName
					],
					[],
					[
						'风险序号', '风险编号', '风险因素', '风险因素总体描述', '风险事件可能性L', '风险事件可能性L的描述', '暴露于危险环境的频繁程度E', '暴露于危险环境的频繁程度E的描述', '发生事故产生的后果C', '发生事故产生的后果C的描述', '综合风险因子D', '风险等级', '危险程度', '管控措施'
					]
				]
			}
		];
		reportData.risks.forEach((item, index) => {
			let dataItem = [index + 1, item.id, item.title, item.factorDesc, item.isL, item.factorLdesc, item.isE, item.factorEdesc, item.isC, item.factorCdesc, item.isD, item.rank, item.importantDepth, item.measure];
			report[0].data.push(dataItem);
		});
		let buffer = XLSX.build(report);
		let newExcel = username + '_' + Date.now() + '.xlsx';
		let newPath = path.join(__dirname, '../../', '/public/userExcel/' + newExcel);
		fs.writeFile(newPath, buffer, (err) => {
			if (err) {
				console.log(err);
			}
			// 创建report对象数据
			let reportObj = {
				url: newExcel,
				reportTitle: reportData.reportTitle,
				address: reportData.address,
				companyName: reportData.companyName,
				categoryName: reportData.categoryName,
				reportTime: reportData.reportTime,
				tel: reportData.tel,
				reportPerson: reportData.reportPerson,
				risks: reportData.risks,
			};
			// 创建report数据模型并储存
			let _reportObj = new Report(reportObj);
			_reportObj.save((err, report) => {
				// 生成报告源为暂存的报告
				if (reportData._id) {  // 暂存报告经过编辑后生成报告，需要把原先暂存的报告删除
					TemporaryReport.remove({_id: reportData._id}, (err, temporaryReport) => {
						AppUser.findOne({_id: appUserId}, (err, appUser) => {
							let index = appUser.temporaryReport.indexOf(reportData._id);
							if (index > -1) {
								appUser.temporaryReport.splice(index, 1);
								appUser.save((err, _appUser) => {
									AppUser.findById(appUserId, (err, appUser) => {
										if (appUser) {
											appUser.report.push(report._id);
											appUser.save((err, appUser) => {
												return res.json({
													success: 1,
													data: {
														msg: 'Excel保存成功'
													}
												})
											})
										} else {
											return res.json({
												success: 0,
												data: {
													msg: '信息过期, 请退出重新登录'
												}
											})
										}
									})
								});
							}
						})
					});
				}else {
					// 直接生成报告，未经过暂存
					// 把新生成的report id存入用户
					AppUser.findById(appUserId, (err, appUser) => {
						if (appUser) {
							appUser.report.push(report._id);
							appUser.save((err, appUser) => {
								if (err) {
									console.log(err);
								}
								return res.json({
									success: 1,
									data: {
										msg: 'Excel保存成功'
									}
								})
							})
						} else {
							return res.json({
								success: 0,
								data: {
									msg: '信息过期, 请退出重新登录'
								}
							})
						}
					})
				}
			});
		})
	} catch (err) {
		console.log('err', err)
	}
});


// 暂存报告
router.post('/tsmsjtu/temporaryReport/save', Auth.requiredToken, (req, res) => {
	try {
		let userInfo = req.userInfo;
		let username = userInfo.data.split('&')[2].split('=')[1];
		let reportData = req.body;
		let appUserId = req.userInfo.data.split('&')[1].split('=')[1];
		// 创建report对象数据
		let reportObj = {
			companyId: reportData.companyId,
			reportTitle: reportData.reportTitle,
			address: reportData.address,
			companyName: reportData.companyName,
			categoryName: reportData.categoryName,
			reportTime: reportData.reportTime,
			tel: reportData.tel,
			reportPerson: reportData.reportPerson,
			risks: reportData.risks,
		};
		if (reportData._id) {  // 如果存在说明_id, 说明是继续暂存, 此次无需把temporaryReportId存入appUser中
			TemporaryReport.findById(reportData._id, (err, _report) => {
				let _reportObj = Object.assign(_report, reportObj);
				_reportObj.save((err, report) => {
					return res.json({
						success: 1,
						data: {
							msg: '报告暂存成功'
						}
					})
				})
			})
		} else {  // 不存在_id, 说明是第一次暂存, 此时还没有temporaryReportId, 应存入appUser中
			// 创建temporaryReport数据模型并储存
			let _reportObj = new TemporaryReport(reportObj);
			_reportObj.save((err, report) => {
				if (err) {
					console.log(err);
				}
				// 把新生成的temporaryReportId存入用户
				AppUser.findById(appUserId, (err, appUser) => {
					if (err) {
						console.log(err);
					}
					if (appUser) {
						appUser.temporaryReport.push(report._id);
						appUser.save((err, appUser) => {
							return res.json({
								success: 1,
								data: {
									msg: '报告暂存成功'
								}
							})
						})
					} else {
						return res.json({
							success: 0,
							data: {
								msg: '信息过期, 请退出重新登录'
							}
						})
					}
				})
			});
		}
	} catch (err) {
		console.log('err', err)
	}
});

// 获取所有excel文件具体信息，传到前台预览
router.get('/tsmsjtu/report/all', Auth.requiredToken, (req, res) => {
	let userInfo = req.userInfo;
	let appUserId = userInfo.data.split('&')[1].split('=')[1];
	if (appUserId) {
		AppUser.findOne({_id: appUserId})
			.populate('report', 'url reportTitle companyName categoryName tel reportTime')
			.exec((err, appUser) => {
				if (err) {
					console.log(err);
				}
				if (appUser) {
					return res.json({
						success: 1,
						data: appUser.report
					})
				}
			})
	}
});


// 获取所有暂存的报告
router.get('/tsmsjtu/temporaryReport/all', Auth.requiredToken, (req, res) => {
	try {
		let userInfo = req.userInfo;
		let appUserId = userInfo.data.split('&')[1].split('=')[1];
		if (appUserId) {
			AppUser.findOne({_id: appUserId})
				.populate('temporaryReport', 'url reportTitle companyName categoryName tel reportTime')
				.exec((err, appUser) => {
					if (err) {
						console.log(err);
					}
					if (appUser) {
						return res.json({
							success: 1,
							data: appUser.temporaryReport
						})
					}
				})
		}
	} catch (err) {
		console.log('err', err)
	}
});

// 获得某个id下excel文件的数据
router.get('/tsmsjtu/report/detail', Auth.requiredToken, (req, res) => {
	let reportId = req.query.reportId;
	Report.findById(reportId, (err, report) => {
		if (err) {
			console.log(err);
		}
		if (report) {
			return res.json({
				success: 1,
				data: report
			})
		}
	})
});

// 获得某个id的暂存报告文件的数据
router.get('/tsmsjtu/temporaryReport/detail', Auth.requiredToken, (req, res) => {
	let reportId = req.query.reportId;
	TemporaryReport.findById(reportId, (err, report) => {
		if (err) {
			console.log(err);
		}
		if (report) {
			return res.json({
				success: 1,
				data: report
			})
		}
	})
});

// 删除某个id的excel文件数据
router.delete('/tsmsjtu/report/del', Auth.requiredToken, (req, res) => {
	let reportId = req.query.reportId;
	let appUserId = req.userInfo.data.split('&')[1].split('=')[1];
	AppUser.findById(appUserId, (err, appUser) => {
		if (err) {
			console.log(err);
		}
		if (appUser) {
			let index = appUser.report.indexOf(reportId);
			appUser.report.splice(index, 1);
			appUser.save((err, appUser) => {
				if (err) {
					console.log(err);
				}
				Report.remove({_id: reportId}, (err, report) => {
					if (err) {
						console.log(err);
					}
					return res.json({
						success: 1,
						data: {
							msg: '删除成功'
						}
					})
				})
			})
		}
	});
});

router.delete('/tsmsjtu/temporaryReport/del', Auth.requiredToken, (req, res) => {
	let reportId = req.query.reportId;
	let appUserId = req.userInfo.data.split('&')[1].split('=')[1];
	AppUser.findById(appUserId, (err, appUser) => {
		if (err) {
			console.log(err);
		}
		if (appUser) {
			let index = appUser.temporaryReport.indexOf(reportId);
			appUser.temporaryReport.splice(index, 1);
			appUser.save((err, appUser) => {
				if (err) {
					console.log(err);
				}
				TemporaryReport.remove({_id: reportId}, (err, report) => {
					if (err) {
						console.log(err);
					}
					return res.json({
						success: 1,
						data: {
							msg: '删除成功'
						}
					})
				})
			})
		}
	});
});

module.exports = router;
