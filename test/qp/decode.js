
var mime = require( '../../' )
var equal = require( 'assert' ).equal

module.exports = {

  'Unicode': function() {
    equal(
      mime.decodeQP( '=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB' ),
      '①⓫⅓㏨♳𝄞λ'
    )
  },

  // 'Japanese (SJIS)': function() {
  //   equal(
  //     mime.decodeQP( '=8E=84=82=CD=81AD-LOVE=89^=89c=83X=83^=83b=83t=82=CC=89Y=93c=82=C6=90\=82=B5=82=DC=82=B7=81B', 'shift_jis' ),
  //     '私は、D-LOVE運営スタッフの浦田と申します。'
  //   )
  // }

}
