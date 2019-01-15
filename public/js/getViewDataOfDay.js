$(document).ready(function () {
	var dayChart = echarts.init(document.getElementById('day_pv_show'));
	var nowDay = moment(Date.now()).format("YYYY-MM-DD");
	getDayViewData(nowDay, dayChart);
	
	layui.use('laydate', function () {
		var laydate_day = layui.laydate;
		//执行一个laydate实例
		laydate_day.render({
			elem: '#date_select_day', //指定元素
			value: new Date(),
			done: function (value) {
				getDayViewData(value, dayChart)
			}
		});
	});
	
	function getDayViewData(day, myChart) {
		//day: string YYYY-MM-DD表示的日期
		$.ajax({
			url: '/admin/viewData/day',
			type: 'POST',
			data: {
				day: day
			}
		}).done(function (res) {
			if (res.success === 1) {
				updateViewDataOfDay(day, res.data.pvs, myChart);
			} else {
				layer.msg("数据获取失败,请检查网络!")
			}
		})
	}
	
	function updateViewDataOfDay(day, pvsOfDay, myChart) {
		var pvsOfSelectDay = Array.from({length: 24}, function (item, index) {
			return item = 0
		});
		var uvsItemOfSelectDay = Array.from({length: 24}, function (item, index) {
			return item = []
		});
		pvsOfDay.forEach(function (pvOfDay, index) {
			if (moment(pvOfDay.meta.createAt).get("hour") < 1) {
				uvsItemOfSelectDay[0].push(pvOfDay.ip);
				pvsOfSelectDay[0] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 2) {
				uvsItemOfSelectDay[1].push(pvOfDay.ip);
				pvsOfSelectDay[1] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 3) {
				uvsItemOfSelectDay[2].push(pvOfDay.ip);
				pvsOfSelectDay[2] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 4) {
				uvsItemOfSelectDay[3].push(pvOfDay.ip);
				pvsOfSelectDay[3] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 5) {
				uvsItemOfSelectDay[4].push(pvOfDay.ip);
				pvsOfSelectDay[4] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 6) {
				uvsItemOfSelectDay[5].push(pvOfDay.ip);
				pvsOfSelectDay[5] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 7) {
				uvsItemOfSelectDay[6].push(pvOfDay.ip);
				pvsOfSelectDay[6] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 8) {
				uvsItemOfSelectDay[7].push(pvOfDay.ip);
				pvsOfSelectDay[7] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 9) {
				uvsItemOfSelectDay[8].push(pvOfDay.ip);
				pvsOfSelectDay[8] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 10) {
				uvsItemOfSelectDay[9].push(pvOfDay.ip);
				pvsOfSelectDay[9] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 11) {
				uvsItemOfSelectDay[10].push(pvOfDay.ip);
				pvsOfSelectDay[10] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 12) {
				uvsItemOfSelectDay[11].push(pvOfDay.ip);
				pvsOfSelectDay[11] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 13) {
				uvsItemOfSelectDay[12].push(pvOfDay.ip);
				pvsOfSelectDay[12] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 14) {
				uvsItemOfSelectDay[13].push(pvOfDay.ip);
				pvsOfSelectDay[13] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 15) {
				uvsItemOfSelectDay[14].push(pvOfDay.ip);
				pvsOfSelectDay[14] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 16) {
				uvsItemOfSelectDay[15].push(pvOfDay.ip);
				pvsOfSelectDay[15] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 17) {
				uvsItemOfSelectDay[16].push(pvOfDay.ip);
				pvsOfSelectDay[16] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 18) {
				uvsItemOfSelectDay[17].push(pvOfDay.ip);
				pvsOfSelectDay[17] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 19) {
				uvsItemOfSelectDay[18].push(pvOfDay.ip);
				pvsOfSelectDay[18] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 20) {
				uvsItemOfSelectDay[19].push(pvOfDay.ip);
				pvsOfSelectDay[19] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 21) {
				uvsItemOfSelectDay[20].push(pvOfDay.ip);
				pvsOfSelectDay[20] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 22) {
				uvsItemOfSelectDay[21].push(pvOfDay.ip);
				pvsOfSelectDay[21] += 1;
			} else if (moment(pvOfDay.meta.createAt).get("hour") < 23) {
				uvsItemOfSelectDay[22].push(pvOfDay.ip);
				pvsOfSelectDay[22] += 1;
			} else {
				uvsItemOfSelectDay[23].push(pvOfDay.ip);
				pvsOfSelectDay[23] += 1;
			}
		});
		var uvsOfSelectDay = Array.from({length: 24}, (item, index) => item = 0);
		uvsItemOfSelectDay.forEach((uvOfSelectDay, index) => {
			uvsOfSelectDay[index] = delRepeat(uvOfSelectDay).length;
		})
		updateChartOfDay(day, pvsOfDay, pvsOfSelectDay, uvsOfSelectDay, myChart);
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
	
	function updateChartOfDay(day, pvsOfDay, pvsOfSelectDay, uvsOfSelectDay, myChart) {
		var day_current_pvs = document.getElementById("day_current_pvs");
		var day_current_uvs = document.getElementById("day_current_uvs");
		day_current_pvs.innerHTML = '网站当日访客数：' + delRepeatIp(pvsOfDay).length;
		day_current_uvs.innerHTML = '网站当日浏览数：' + pvsOfSelectDay.reduce(function (prev, cur) {
			return prev + cur;
		}, 0);
		myChart.setOption({
			title: {
				text: `${moment(day).format("YYYY-MM-DD")} 的访问记录`,
				left: 'center'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: "cross"
				},
				formatter: function (params) {
					return [`${moment(day).format("YYYY-MM-DD")} ${params[0].name}-${(params[0].dataIndex + 1) > 10 ? (params[0].dataIndex + 1) : '0' + (params[0].dataIndex + 1)}:00` + '<hr size=1 style="margin:3px 0"/>', '浏览次数：' + params[0].data + "<br />", "独立访客：" + params[1].data].join("");
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
				data: ['当日各时段网站浏览数', '当日各时段网站访客数']
			},
			xAxis: {
				data: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
					"08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
					"16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",]
			},
			yAxis: {
				name: '人数',
			},
			series: [
				{
					name: '当日各时段网站浏览数',
					type: 'line',
					color: '#4891D4',
					
					data: pvsOfSelectDay
				},
				{
					name: '当日各时段网站访客数',
					type: 'line',
					color: '#80BB51',
					data: uvsOfSelectDay
				}
			]
		})
	}
});