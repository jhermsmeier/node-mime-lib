
var mime = require( '../../' )
var equal = require( 'assert' ).equal

module.exports = {

  'ASCII': function() {
    equal(
      mime.urlEncode( 'ABC%äöü+& ²' ),
      'ABC%25%C3%A4%C3%B6%C3%BC%2B%26%20%C2%B2'
    )
  }

}
