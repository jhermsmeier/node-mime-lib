
var mime = require( '../../' )
var equal = require( 'assert' ).equal

module.exports = {
  
  'ASCII': function() {
    equal(
      mime.encodeQP( 'ABC123' ),
      'ABC123'
    )
  },
  
  'Unicode': function() {
    equal(
      mime.encodeQP( '①⓫⅓㏨♳𝄞λ' ),
      '=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB'
    )
  },
  
  'Japanese (ISO 2022 JP)': function() {
    equal(
      mime.encodeQP( 'ﾂ環ｮﾂ全ﾂ鳴ｳﾂ猟ｿﾂづﾂ、' ),
      '=EF=BE=82=E7=92=B0=EF=BD=AE=EF=BE=82=E5=85=A8=EF=BE=82=E9=B3=B4=EF=BD=B3=EF=BE=82=E7=8C=9F=EF=BD=BF=EF=BE=82=E3=81=A5=EF=BE=82=E3=80=81'
    )
  }
  
}
