
var mime = require( '../../' )
var equal = require( 'assert' ).equal

module.exports = {
  
  'Unicode': function() {
    equal(
      mime.encodeWord( '①⓫⅓㏨♳𝄞λ' ),
      '=?UTF-8?Q?=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB?='
    )
  }
  
}
