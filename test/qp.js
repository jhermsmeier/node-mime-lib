var assert = require( 'assert' )
var mime = require( '..' )

describe( 'MIME', function() {

  context( 'Quoted Printable', function() {

    context( 'Encode', function() {

      specify('ASCII', function() {
        assert.equal(
          mime.encodeQP( 'ABC123' ),
          'ABC123'
        )
      })

      specify('Unicode', function() {
        assert.equal(
          mime.encodeQP( '①⓫⅓㏨♳𝄞λ' ),
          '=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB'
        )
      })

      specify('Japanese (ISO 2022 JP)', function() {
        assert.equal(
          mime.encodeQP( 'ﾂ環ｮﾂ全ﾂ鳴ｳﾂ猟ｿﾂづﾂ、' ),
          '=EF=BE=82=E7=92=B0=EF=BD=AE=EF=BE=82=E5=85=A8=EF=BE=82=E9=B3=B4=EF=BD=B3=EF=BE=82=E7=8C=9F=EF=BD=BF=EF=BE=82=E3=81=A5=EF=BE=82=E3=80=81'
        )
      })

    })

    context( 'Decode', function() {

      specify('Unicode', function() {
        assert.equal(
          mime.decodeQP( '=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB' ),
          '①⓫⅓㏨♳𝄞λ'
        )
      })

      specify('Japanese (SJIS)', function() {
        assert.equal(
          mime.decodeQP( '=8E=84=82=CD=81AD-LOVE=89^=89c=83X=83^=83b=83t=82=CC=89Y=93c=82=C6=90\\=82=B5=82=DC=82=B7=81B', 'shift_jis' ),
          '私は、D-LOVE運営スタッフの浦田と申します。'
        )
      })

    })

    context( 'Encode Word', function() {

      specify('Unicode', function() {
        assert.equal(
          mime.encodeWord( '①⓫⅓㏨♳𝄞λ' ),
          '=?UTF-8?Q?=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB?='
        )
      })

    })

    context( 'Decode Word', function() {

      specify('Unicode', function() {
        assert.equal(
          mime.decodeWord( '=?UTF-8?Q?=E2=91=A0=E2=93=AB=E2=85=93=E3=8F=A8=E2=99=B3=F0=9D=84=9E=CE=BB?=' ),
          '①⓫⅓㏨♳𝄞λ'
        )
      })

      specify('Unicode2', function() {
        assert.equal(
          mime.decodeWord( '=?UTF-8?Q?a=c5=82o=c5=9b-?=' ),
          'ałoś-'
        )
      })

      specify('Chinese (GB 2312)', function() {
        assert.equal(
          mime.decodeWord( '=?GB2312?B?xvMg0rUgssMg1LEgt+cgz9UgueYgsdwwNDozNzoyMQ==?=' ),
          '企 业 裁 员 风 险 规 避04:37:21'
        )
      })

      specify('Japanese, Base64 (ISO-2022-JP)', function() {
        assert.equal(
          mime.decodeWord( '=?ISO-2022-JP?B?joSCzYFBRC1MT1ZFiV6JY4NYg16DYoN0gsyJWZNjgsaQXIK1gtyCt4FC?=' ),
          '私は、D-LOVE運営スタッフの浦田と申します。'
        )
      })

      specify('Japanese, QP (ISO-2022-JP)', function() {
        assert.equal(
          mime.decodeWord( '=?ISO-2022-JP?Q?=8E=84=82=CD=81AD-LOVE?=' ),
          '私は、D-LOVE'
        )
      })

    })

  })

})
