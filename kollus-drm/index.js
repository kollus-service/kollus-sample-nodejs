const crypto = require('crypto');
var moment = require('moment');
var jwt = require('jsonwebtoken');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const securityKey = 'catenoid-sample'; // 콜러스 콘솔 -> 설정 페이지 -> 서비스 계정 키
const customKey = '87db3539e2614f6406c88761a3d0bc39e1895544801af9cd202c54f821b42fb8'; // 콜러스 콘솔 -> 설정 페이지 -> 사용자 키
const mediaContentKey = 'qeSN3adT'; // 미디어 컨텐츠 키
const clientUserId = 'as1as'; //홈페이지 사용자 아이디
var expireDate = moment().unix()+3600;
var payload = (
	{
		'expt' : expireDate, //
		'cuid' : clientUserId,
		'mc' : (
			[{
				'mckey' : mediaContentKey
			}]
		)
	}
);

console.log("https://v.kr.kollus.com/s?jwt="+ jwt.sign(payload,securityKey)+"&custom_key="+customKey);