$(document).ready(function () {
	
	var yearChart = echarts.init(document.getElementById('year_pv_show'));
	// 初始化页面
	var nowYear = moment(new Date()).format("YYYY");
	
	getYearViewData(nowYear, yearChart);
	
	
	layui.use('laydate', function () {
		var laydate_year = layui.laydate;
		//执行一个laydate实例
		laydate_year.render({
			elem: '#date_select_year', //指定元素
			type: 'year',
			value: moment(new Date()).format("YYYY"),
			done: function (value) {
				getYearViewData(value, yearChart);
			}
		});
	});
	
	// 按月查询
	function getYearViewData(year, myChart) {
		$.ajax({
			url: '/admin/viewData/year',
			type: 'POST',
			data: {
				year: year
			}
		}).done(function (res) {
			if (res.success === 1) {
				updateViewDataOfYear(year, res.data.pvs, myChart)
			} else {
				layer.msg("数据获取失败,请检查网络!")
			}
		})
	}
	
	
	function updateViewDataOfYear(year, pvsOfYear, myChart) {
		var currentYearMonth = 12;
		var pvsOfSelectYear = Array.from({length: currentYearMonth}, function (item, index) {
			return item = 0
		});
		var uvsItemOfSelectYear = Array.from({length: currentYearMonth}, function (item, index) {
			return item = []
		});
		pvsOfYear.forEach(function (pvOfYear, index) {
			if (moment(pvOfYear.meta.createAt).get("month") < 1) {
				uvsItemOfSelectYear[0].push(pvOfYear.ip);
				pvsOfSelectYear[0] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 2) {
				uvsItemOfSelectYear[1].push(pvOfYear.ip);
				pvsOfSelectYear[1] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 3) {
				uvsItemOfSelectYear[2].push(pvOfYear.ip);
				pvsOfSelectYear[2] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 4) {
				uvsItemOfSelectYear[3].push(pvOfYear.ip);
				pvsOfSelectYear[3] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 5) {
				uvsItemOfSelectYear[4].push(pvOfYear.ip);
				pvsOfSelectYear[4] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 6) {
				uvsItemOfSelectYear[5].push(pvOfYear.ip);
				pvsOfSelectYear[5] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 7) {
				uvsItemOfSelectYear[6].push(pvOfYear.ip);
				pvsOfSelectYear[6] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 8) {
				uvsItemOfSelectYear[7].push(pvOfYear.ip);
				pvsOfSelectYear[7] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 9) {
				uvsItemOfSelectYear[8].push(pvOfYear.ip);
				pvsOfSelectYear[8] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 10) {
				uvsItemOfSelectYear[9].push(pvOfYear.ip);
				pvsOfSelectYear[9] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 11) {
				uvsItemOfSelectYear[10].push(pvOfYear.ip);
				pvsOfSelectYear[10] += 1;
			} else if (moment(pvOfYear.meta.createAt).get("month") < 12) {
				uvsItemOfSelectYear[11].push(pvOfYear.ip);
				pvsOfSelectYear[11] += 1;
			}
		});
		var uvsOfSelectYear = Array.from({length: currentYearMonth}, function (item, index) {
			return item = 0
		});
		uvsItemOfSelectYear.forEach((uvOfSelectYear, index) => {
			uvsOfSelectYear[index] = delRepeat(uvOfSelectYear).length;
		});
		updateChartOfDayYear(year, pvsOfYear, pvsOfSelectYear, uvsOfSelectYear, myChart);
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
	
	
	
	function updateChartOfDayYear(year, pvsOfYear, pvsOfSelectYear, uvsOfSelectYear, myChart) {
		var year_current_pvs = document.getElementById("year_current_pvs");
		var year_current_uvs = document.getElementById("year_current_uvs");
		year_current_pvs.innerHTML = '网站当年访客数：' + delRepeatIp(pvsOfYear).length;
		year_current_uvs.innerHTML = '网站当年浏览数：' + pvsOfSelectYear.reduce(function (prev, cur) {
			return prev + cur;
		}, 0);
		myChart.setOption({
			title: {
				text: `${moment(year).format("YYYY")}年的访问记录`,
				left: 'center'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: "cross"
				},
				formatter: function (params) {
					return [`${moment(year).format("YYYY")}-${params[0].name >= 10 ? params[0].name : '0' + params[0].name}` + '<hr size=1 style="margin:3px 0"/>', '浏览次数：' + params[0].data + "<br />", "独立访客：" + params[1].data].join("");
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
				data: ['当年各月网站浏览数', '当年各月网站访客数']
			},
			xAxis: {
				data: Array.from({length: 12}, function(item, index){return item = index+1})
			},
			yAxis: {
				name: '人数',
			},
			series: [
				{
					name: '当年各月网站浏览数',
					type: 'line',
					color: '#4891D4',
					
					data: pvsOfSelectYear
				},
				{
					name: '当年各月网站访客数',
					type: 'line',
					color: '#80BB51',
					data: uvsOfSelectYear
				}
			]
		})
	}
})