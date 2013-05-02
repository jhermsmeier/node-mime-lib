
var mime = require( '../../' )
var equal = require( 'assert' ).equal

module.exports = {
  
  'Unicode': function() {
    equal(
      mime.decodeWord( '=?UTF-8?Q?=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB?=' ),
      '①⓫⅓㏨♳𝄞λ'
    )
  },
  
  'Chinese (GB 2312)': function() {
    equal(
      mime.decodeWord( '=?GB2312?B?xvMg0rUgssMg1LEgt+cgz9UgueYgsdwwNDozNzoyMQ==?=' ),
      '企 业 裁 员 风 险 规 避04:37:21'
    )
  },
  
  'Japanese (ISO 2022 JP)': function() {
    equal(
      mime.decodeWord( '=?ISO-2022-JP?Q?=8E=84=82=CD=81AD-LOVE?=' ),
      '私は、D-LOVE'
    )
  }
  
}
