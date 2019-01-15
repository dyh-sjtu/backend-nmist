$(document).ready(function () {
	var monthChart = echarts.init(document.getElementById('month_pv_show'));
	// 初始化页面
	var nowMonth = moment(new Date()).format("YYYY-MM");
	
	getMonthViewData(nowMonth, monthChart);
	
	
	layui.use('laydate', function () {
		var laydate_month = layui.laydate;
		//执行一个laydate实例
		laydate_month.render({
			elem: '#date_select_month', //指定元素
			type: 'month',
			value: moment(new Date()).format("YYYY-MM"),
			done: function (value) {
				getMonthViewData(value, monthChart);
			}
		});
	});
	
	// 按月查询
	function getMonthViewData(month, myChart) {
		$.ajax({
			url: '/admin/viewData/month',
			type: 'POST',
			data: {
				month: month
			}
		}).done(function (res) {
			if (res.success === 1) {
				updateViewDataOfMonth(month, res.data.pvs, myChart)
			} else {
				layer.msg("数据获取失败,请检查网络!")
			}
		})
	}
	
	
	function updateViewDataOfMonth(month, pvsOfDay, myChart) {
		var currentMonthDay = mGetDate(month);
		var pvsOfSelectDay = Array.from({length: currentMonthDay}, function (item, index) {
			return item = 0
		});
		var uvsItemOfSelectDay = Array.from({length: currentMonthDay}, function (item, index) {
			return item = []
		});
		pvsOfDay.forEach(function (pvOfDay, index) {
			if (moment(pvOfDay.meta.createAt).get("date") <= 1) {
				uvsItemOfSelectDay[0].push(pvOfDay.ip);
				pvsOfSelectDay[0] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 2) {
				uvsItemOfSelectDay[1].push(pvOfDay.ip);
				pvsOfSelectDay[1] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 3) {
				uvsItemOfSelectDay[2].push(pvOfDay.ip);
				pvsOfSelectDay[2] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 4) {
				uvsItemOfSelectDay[3].push(pvOfDay.ip);
				pvsOfSelectDay[3] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 5) {
				uvsItemOfSelectDay[4].push(pvOfDay.ip);
				pvsOfSelectDay[4] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 6) {
				uvsItemOfSelectDay[5].push(pvOfDay.ip);
				pvsOfSelectDay[5] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 7) {
				uvsItemOfSelectDay[6].push(pvOfDay.ip);
				pvsOfSelectDay[6] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 8) {
				uvsItemOfSelectDay[7].push(pvOfDay.ip);
				pvsOfSelectDay[7] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 9) {
				uvsItemOfSelectDay[8].push(pvOfDay.ip);
				pvsOfSelectDay[8] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 10) {
				uvsItemOfSelectDay[9].push(pvOfDay.ip);
				pvsOfSelectDay[9] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 11) {
				uvsItemOfSelectDay[10].push(pvOfDay.ip);
				pvsOfSelectDay[10] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 12) {
				uvsItemOfSelectDay[11].push(pvOfDay.ip);
				pvsOfSelectDay[11] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 13) {
				uvsItemOfSelectDay[12].push(pvOfDay.ip);
				pvsOfSelectDay[12] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 14) {
				uvsItemOfSelectDay[13].push(pvOfDay.ip);
				pvsOfSelectDay[13] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 15) {
				uvsItemOfSelectDay[14].push(pvOfDay.ip);
				pvsOfSelectDay[14] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 16) {
				uvsItemOfSelectDay[15].push(pvOfDay.ip);
				pvsOfSelectDay[15] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 17) {
				uvsItemOfSelectDay[16].push(pvOfDay.ip);
				pvsOfSelectDay[16] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 18) {
				uvsItemOfSelectDay[17].push(pvOfDay.ip);
				pvsOfSelectDay[17] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 19) {
				uvsItemOfSelectDay[18].push(pvOfDay.ip);
				pvsOfSelectDay[18] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 20) {
				uvsItemOfSelectDay[19].push(pvOfDay.ip);
				pvsOfSelectDay[19] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 21) {
				uvsItemOfSelectDay[20].push(pvOfDay.ip);
				pvsOfSelectDay[20] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 22) {
				uvsItemOfSelectDay[21].push(pvOfDay.ip);
				pvsOfSelectDay[21] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 23) {
				uvsItemOfSelectDay[22].push(pvOfDay.ip);
				pvsOfSelectDay[22] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 24) {
				uvsItemOfSelectDay[23].push(pvOfDay.ip);
				pvsOfSelectDay[23] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 25) {
				uvsItemOfSelectDay[24].push(pvOfDay.ip);
				pvsOfSelectDay[24] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 26) {
				uvsItemOfSelectDay[25].push(pvOfDay.ip);
				pvsOfSelectDay[25] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 27) {
				uvsItemOfSelectDay[26].push(pvOfDay.ip);
				pvsOfSelectDay[26] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= 28) {
				uvsItemOfSelectDay[27].push(pvOfDay.ip);
				pvsOfSelectDay[27] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= currentMonthDay && moment(pvOfDay.meta.createAt).get("date") <= 29) {
				uvsItemOfSelectDay[28].push(pvOfDay.ip);
				pvsOfSelectDay[28] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= currentMonthDay && moment(pvOfDay.meta.createAt).get("date") <= 30) {
				uvsItemOfSelectDay[29].push(pvOfDay.ip);
				pvsOfSelectDay[29] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("date") <= currentMonthDay && moment(pvOfDay.meta.createAt).get("date") <= 31) {
				uvsItemOfSelectDay[30].push(pvOfDay.ip);
				pvsOfSelectDay[30] += 1;
			}
		});
		var uvsOfSelectDay = Array.from({length: currentMonthDay}, function (item, index) {
			return item = 0
		});
		uvsItemOfSelectDay.forEach((uvOfSelectDay, index) => {
			uvsOfSelectDay[index] = delRepeat(uvOfSelectDay).length;
		})
		updateChartOfDayMonth(month, pvsOfDay, pvsOfSelectDay, uvsOfSelectDay, myChart);
	}
	
	function mGetDate(month) {
		var _year = moment(month).get('year');
		var _month = moment(month).get('month')+1;
		var d = new Date(_year, _month, 0);
		return d.getDate();
	}
	
	function delRepeat(arr) {
		var noRepeatArr = [];
		arr.forEach(function (item, index) {
			if (noRepeatArr.indexOf(item) === -1) {
				noRepeatArr.push(item);
			}
		})
		return noRepeatArr;
		
	}
	
	function delRepeatIp(pvs) {
		var noRepeatArr = [];
		pvs.forEach(function (pv, index) {
			if (noRepeatArr.indexOf(pv.ip) === -1) {
				noRepeatArr.push(pv.ip);
			}
		})
		return noRepeatArr;
	}
	
	
	
	function updateChartOfDayMonth(month, pvsOfDay, pvsOfSelectDay, uvsOfSelectDay, myChart) {
		var month_current_pvs = document.getElementById("month_current_pvs");
		var month_current_uvs = document.getElementById("month_current_uvs");
		month_current_pvs.innerHTML = '网站当月访客数：' + delRepeatIp(pvsOfDay).length;
		month_current_uvs.innerHTML = '网站当月浏览数：' + pvsOfSelectDay.reduce(function (prev, cur) {
			return prev + cur;
		}, 0);
		myChart.setOption({
			title: {
				text: `${moment(month).format("YYYY-MM")} 的访问记录`,
				left: 'center'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: "cross"
				},
				formatter: function (params) {
					return [`${moment(month).format("YYYY-MM")}-${params[0].name >= 10 ? params[0].name : '0' + params[0].name}` + '<hr size=1 style="margin:3px 0"/>', '浏览次数：' + params[0].data + "<br />", "独立访客：" + params[1].data].join("");
				}
			},
			toolbox: {
				top: 0,
				right: 110,
				feature: {
					dataView: {
						show: true,
						readOnly: false
					},
					restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			legend: {
				bottom: 10,
				left: 'center',
				data: ['当月各日网站浏览数', '当月各日网站访客数']
			},
			xAxis: {
				data: Array.from({length: mGetDate(month)}, function(item, index){return item = index+1})
			},
			yAxis: {
				name: '人数',
			},
			series: [
				{
					name: '当月日网站浏览数',
					type: 'line',
					color: '#4891D4',
					
					data: pvsOfSelectDay
				},
				{
					name: '当月各日网站访客数',
					type: 'line',
					color: '#80BB51',
					data: uvsOfSelectDay
				}
			]
		})
	}
})