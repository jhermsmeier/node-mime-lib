var assert = require( 'assert' )
var mime = require( '..' )

describe( 'MIME', function() {

  context( 'Types', function() {

    specify( 'type', function() {
      assert.equal('text/html', mime.type('html'));
      assert.equal('video/mp4', mime.type('mp4'));
      assert.equal('application/octet-stream', mime.type('nonexistent'));
    })

    specify( 'extension', function() {
      var htmlExts = mime.extension('text/html');
      assert.equal('htm', htmlExts[0]);
      assert.equal('html', htmlExts[1]);
      assert.equal(undefined, mime.extension('nonexistant'))
    })

  })

  context( 'URI', function() {

    specify( 'ASCII', function() {
      assert.equal(
        mime.urlEncode( 'ABC%äöü+& ²' ),
        'ABC%25%C3%A4%C3%B6%C3%BC%2B%26%20%C2%B2'
      )
    })

  })

})
