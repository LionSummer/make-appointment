
const Code ={
	SystemErr: 400,
	SelectTimeErr: 401,	/// 时间段错误
	SelectNumLimit: 402, 	/// 时间段内次数已满
	OptionalNotExist: 403,	/// 选项数据不存在
	StatusErr: 405, 		/// 状态错误
	NotOpenTime: 406, 		/// 未在开放时间内
}
const Message = {
	'400': '系统错误',
	'401': '选择的时间段错误',
	'402': '时间段内次数达上限',
	'403': '选项数据不存在',
	'405': '选项的状态错误',
	'406': '未在开放时间内',
}

const startDay = 1, endDay = 6;
const startHours = 9, endHours = 15;
const hoursSelectLimit = 6;


let optionObj = {
	id: '',			/// 选项唯一id
	name: '',		/// 选项名称
	isSelect: true,	/// 是否可使用
	selectDate: ''
}

g_AllOptionals = null;
const nameList = [
"李连杰","成龙","吴京","科比","詹姆斯","姚明","马龙",
"习大大","路飞","冯宝宝","唐三","孙悟空","卡卡西",
"刀郎","冯提莫","韩雪","郭德纲","宋小宝","董卿"];


/// 创建可选项数据
function createOptionalData(dateStr, totalDay){
	if(!dateStr){
		return {};
	}

	totalDay = totalDay ? totalDay : 6;
	try{
		let startDate = new Date(dateStr);
		//let localDate = startDate.toLocaleDateString();
		let startTime = startDate.getTime();
		let allOptionals = {};
		for(let d = 1; d <= totalDay; d++){
			let curDate = new Date(startTime + (d * 86400000));
			//console.log('====> curDate = ', curDate)
			let localDateStr = curDate.toLocaleDateString();
			let curDayNum = curDate.getDate();
			
			let dayOptional = {};
			for(let h = startHours; h <= endHours; h++){
				//	console.log('====>h = ', h, curDayNum,dayOptional)
				//if(h >= startHours && h <= endHours){
					for(let r = 0; r <10; r++){
						let index = Math.floor(Math.random()*(nameList.length -1));
						let isBool = 2;//Math.floor(Math.random()*2);
						
						let tempKey = ''+curDayNum + h + r;
						dayOptional[tempKey] = {
							id: tempKey,
							name: nameList[index]+r,		/// 选项名称
							isSelect: isBool < 1 ? false : true,	/// 是否可使用
							//selectDate: '' 		/// 被选择的时间
						}
					}
				//}
			}
			allOptionals[localDateStr] = dayOptional;
		}

		return allOptionals;
	}catch(err){
		return {};
	}
}

let curDateStr = new Date().toLocaleDateString();
g_AllOptionals = createOptionalData(curDateStr, 2);

//console.log('====>g_AllOptionals = ', g_AllOptionals['2020-2-11'])
function isInTimeQuantum(date, hours){
	if(!date || !hours){
		return -1;
	}

	let selectWeeHours = new Date(date).setHours(0, 0, 0, 0);  ///选择某天的凌晨时间
	let nowWeeHours = new Date().setHours(0, 0, 0, 0);		///当天凌晨的时间
	let nowHours = new Date().getHours();	/// 当前小时值

	/// 相差天数
	let differDay = Math.floor(((selectWeeHours - nowWeeHours) / 1000) / 86400);
	if(differDay < startDay || differDay > endDay){
		return -2;
	}

	/// 判断是否在时间段内
	if(nowHours < startHours || nowHours > endHours){
		return -2;
	}


	return 1;
}

/// 获取可选择的选项列表
/*
	@params date
*/
let getOptionals = function (date){
	
	let selectDate = null;
	if(date){
		selectDate = new Date(date).toLocaleDateString();
	}

    //console.log('=getOptionals==> curDate =', selectDate);
	let runList = [];
	/*for(let key in g_AllOptionals){
		if(key == undefined){ continue;}

		let info = g_AllOptionals[key];
		if(info.isSelect == false){ continue;}

		/// 刷选指定日期的
		if(curDate != null){
			/// 是否存在指定的日期
		if(key.indexOf(curDate) < 0){ continue;}

			let keyList = key.split('-');
			if(curDate === keyList[0]+'-'+keyList[1]+'-'+keyList[2]){
				runList.push(info);
			}

			continue;
		}

		/// 反之刷选全部的
		runList.push(info);
	}*/

	runList = {};
	if(selectDate != null){
		let dayOption = g_AllOptionals[selectDate];
		if(dayOption == undefined){
			return [];
		}

		let objList = [];
		for(let dKey in dayOption){
			let info = dayOption[dKey];

			if(info.isSelect == false){ continue;}
			//objList[dKey] = info;
			objList.push(info);
		}
		runList[selectDate] = objList;
	}
	else{
		for(let key in g_AllOptionals){
			if(key == undefined){ continue;}

			let dayOption = g_AllOptionals[key];
			
			let objList = [];//{};
			for(let dKey in dayOption){
				let info = dayOption[dKey];

				if(info.isSelect == false){ continue;}
				//objList[dKey] = info;

				objList.push(info);
			}
			runList[key] = objList;
		}
	}
	return runList;
}

/// 获取时间段内已选的次数
let getHoursSelectNum = function (date, hours){

	if(!date || !hours){
		return -1;
	}

	let selectDate = new Date(date);
	let selectDay = selectDate.getDate();
	let tempSelectDate = selectDate.toLocaleDateString();


    //console.log('=getOptionals==> curDate =', curDate);

    let dayOption = g_AllOptionals[tempSelectDate];
    if(dayOption == undefined){
    	return -2;
    }

	let selectNum = -1;
	for(let key in dayOption){
		if(key == undefined || key.indexOf(selectDay+hours) < 0){ continue;}

		let info = dayOption[key];
		if(!info){ continue;}

		if(selectNum == -1){ selectNum = 0;}
		if(info.isSelect == false)
		{ 
			selectNum += 1;
		}
	}

	return selectNum;
}

/// 预约可选项
/// selectIds = ['','']
let selectOptional = function(date, hours, selectIds){
	try{
		let selectDate = new Date(date);
		let selectDay = selectDate.getDate();
		let tempSelectDate = selectDate.toLocaleDateString();
	    let dayOptional = g_AllOptionals[tempSelectDate];
	    if(dayOptional == undefined){
	    	return Code.OptionalNotExist;
	    }

	    if(isInTimeQuantum(date, hours) != 1){
	    	return Code.NotOpenTime;
	    }
	    /// 判断时间段内的选择数
		let curSelectNum = getHoursSelectNum(date, hours);
		console.log('====> curSelectNum = ', curSelectNum)
		if(curSelectNum < 0){
			return Code.SelectTimeErr;
		}
		if(curSelectNum > 0 && curSelectNum >= hoursSelectLimit){
			return Code.SelectNumLimit;
		}

		/// 修改选项的状态
		for(let s = 0; s < selectIds.length; s++){
			let idStr = selectIds[s];

			let tempId = ''+selectDay + hours;  /// 拼接id
		
			if(idStr.indexOf(tempId) < 0){ return Code.OptionalNotExist;}

			let objInfo = dayOptional[idStr];
			if(objInfo == undefined){ return Code.OptionalNotExist;}

			/// 是否是被选过的id
			if(objInfo.isSelect == false){ return Code.StatusErr;}
			objInfo.isSelect = false;
		}
		return 200;
	}catch(err){
		console.error('==selectOptional==> err =', err);
		return Code.SystemErr;
	}
}


module.exports = {
	messageData: Message,
	getOptionals: getOptionals,
	selectOptional: selectOptional,
	globalOptional: g_AllOptionals
};
