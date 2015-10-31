var mime = require( '../../' )
var equal = require( 'assert' ).equal

module.exports = {

  'type': function() {
    equal('text/html', mime.type('html'));
    equal('video/mp4', mime.type('mp4'));
    equal('application/octet-stream', mime.type('nonexistent'));
  },

  'extension': function() {
    var htmlExts = mime.extension('text/html');
    equal('htm', htmlExts[0]);
    equal('html', htmlExts[1]);
    equal(undefined, mime.extension('nonexistant'))
  }

}
