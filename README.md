# Test Probject


## Install dependencies:

```bash
$ npm install
```

## Http Server
 Start the http server:

```bash
$ npm run http
```

### 调用Api介绍
```
  1、获取全部可选项  / 获取指定日期的可选项
  	GET  localhost:8800/getOptionals		 /  		GET  localhost:8800/getOptionals?seleDate='2020-2-9'	

  	成功返回数据 = {
  		code: 200, message: 'OK', data: {
  			'2020-2-9':[
				{ id: '', name: '', isSelect: false },..
  			],
  			'2020-2-10':[
				{ id: '', name: '', isSelect: false },..
  			]
  		}
  	}
  	错误返回数据 = {code: 400, message: 'SystemErr'}

  3、选择指定时间段的可选项
  	
  	POST localhost:8800/selectOption
  	
  	传参 = {seleDate:'', hours: 2, selectIds:['','',..]}
  	返回数据 = {
  		code: 200, message: 'OK'
  	}

  	message = {
		'400': '系统错误',
		'401': '选择的时间段错误',
		'402': '时间段内次数达上限',
		'403': '选项数据不存在',
		'405': '选项的状态错误',
		'406': '未在开放时间内',
	}
```

## Tests