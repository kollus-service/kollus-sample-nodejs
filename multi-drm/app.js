const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
var moment = require('moment');
var jwt = require('jsonwebtoken');

require('moment-timezone');
moment.tz.setDefault('utc');

const securityKey = ''; // 콜러스 콘솔 -> 설정 페이지 -> 서비스 계정 키
const customKey = ''; // 콜러스 콘솔 -> 설정 페이지 -> 사용자 키
const mediaContentKey = ''; // 미디어 컨텐츠 키
const contentID = ''; // 업로드 파일 키
const accessKey = ''; // 잉카 팰리컨 콘솔 -> drm setting -> Access Key
const siteKey = ''; // 잉카 팰리컨 콘솔 -> drm setting -> Site Key
const siteID = ''; // 잉카 팰리컨 콘솔 -> drm setting -> Site ID
const clientUserId = ''; //홈페이지 사용자 아이디
const iv = '0123456789abcdef';


var agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'; //샘플 유저 에이전트
var supportBrowser = ['CriOS','Edge','Edg','FireFox','Chrome','Safari','Opera','MSIE','Trident'];
var userBrowser = '';
var steamingType = '';
supportBrowser.some(function(arr){
  if(String(agent).match(arr)){
    userBrowser = arr;
	return true;
  }
});
switch(userBrowser){
  case 'MSIE':
    drmType = 'PlayReady';
    streamingType = 'dash';
    break;
  case 'Trident':
      drmType = 'PlayReady';
      streamingType = 'dash';
      break;
  case 'Edge':
    drmType = 'PlayReady';
    streamingType = 'dash';
    break;
  case 'Edg':
    drmType = 'PlayReady';
    streamingType = 'dash';
    break;
  case 'Chrome':
      drmType = 'Widevine';
      streamingType = 'dash';
      break;
  case 'Firefox':
        drmType = 'Widevine';
        streamingType = 'dash';
        break;
  case 'Opera':
        drmType = 'Widevine';
        streamingType = 'dash';
        break;
  case 'Safari':
        drmType = 'FairPlay';
        streamingType = 'hls';
        break;
  case 'CriOS':
        drmType = 'FairPlay';
        streamingType = 'hls';
        break;
}
if(String(agent).match('Macintosh')&&String(agent).match('Edg')){
  drmType = 'Widevine';
  streamingType = 'dash';
}

//var drmType = drmType;
if(drmType=='Widevine'){
	var token = ({
			'policy_version' : 2,
			'playback_policy' : ({
				'persistent' : false,
				'license_duration' : 0
			}),
			'security_policy' : ({
					'widevine' : ({
						'override_device_revocation' : true
})
				})
	}		);
}

var token = (
  {
    'playback_policy' : (
      {
        'limit' : true,
        'persistent' : false,
        'duration' : 86400
      }
    ),
    'allow_mobile_abnormal_device' : false,
    'playready_security_level' : 150
  }
);

token = JSON.stringify(token);
const cipher = crypto.createCipheriv('aes-256-cbc', siteKey, iv);
token = cipher.update(token, 'utf8', 'base64');
token+=cipher.final('base64');

var date = new Date();
var timeStamp = moment(date).format('yyyy-MM-DD') + 'T' + moment(date).format("HH:mm:ss") + "Z";
var hash = accessKey + drmType + siteID + clientUserId + contentID + token + timeStamp;
hash = crypto.createHash('sha256').update(hash).digest('base64');

var inkaPayload = (
  {
    'drm_type' : drmType,
    'site_id' : siteID,
    'user_id' : clientUserId,
    'cid' : contentID,
    'token' : token,
    'timestamp' : timeStamp,
    'hash' : hash
  }
);
inkaPayload = JSON.stringify(inkaPayload);
inkaPayload = Buffer.from(inkaPayload).toString('base64');


var payload = (
	{
		'expt' : 1767139200,
		'cuid' : clientUserId,
		'mc' : (
			[{
				'mckey' : mediaContentKey,
        'drm_policy' : (
          {
            'kind' : 'inka',
            'streaming_type' : streamingType,
            'data' : (
              {
                'license_url' : 'https://license.pallycon.com/ri/licenseManager.do',
                'certificate_url' : 'https://license.pallycon.com/ri/fpsKeyManager.do?siteId=' + siteID,
                'custom_header' : (
                  {
                    'key' : 'pallycon-customdata-v2',
                    'value' : inkaPayload
                  }
                )
              }
            )
          }
        )
			}]
		)
	}
);

console.log("https://v.kr.kollus.com/s?jwt="+ jwt.sign(payload,securityKey)+"&custom_key="+customKey);
