
/**
 * [Mime description]
 */
function Mime() {
  
  var self = this
  var fs   = require( 'fs' )
  var path = require( 'path' )
  
  this.types      = Object.create( null )
  this.extensions = Object.create( null )
  this.default    = this.type( 'bin' )
  
  fs.readFileSync( path.join( __dirname, 'mime.types' ), 'utf-8' )
    .split( /\r?\n/ )
    .forEach( function( exts, type ) {
      
      exts = exts.split( /\s+/ )
      type = exts.shift()
      
      self.extensions[ type ] = exts
      
      exts.forEach( function( ext ) {
        self.types[ ext ] = type
      })
      
    })
  
}

/**
 * Mime prototype
 * @type {Object}
 */
Mime.prototype = {
  
  /**
   * Base64 encodes a buffer or string.
   * 
   * @param  {String|Buffer} input   
   * @param  {String} charset 
   * @return {String} 
   */
  encodeBase64: function( input, charset ) {
    if( Buffer.isBuffer( input ) ) return input.toString( 'base64' )
    else return new Buffer( input, charset ).toString( 'base64' )
  },
  
  /**
   * Decodes a base64 encoded string.
   * 
   * @param  {String} input   
   * @param  {String} charset 
   * @return {String|Buffer} 
   */
  decodeBase64: function( input, charset ) {
    return ( charset )
      ? new Buffer( input, 'base64' ).toString( charset )
      : new Buffer( input, 'base64' )
  },
  
  /**
   * Encodes a string into Quoted-printable format.
   * 
   * @param  {String}  input 
   * @param  {Boolean} multibyte 
   * @param  {Boolean} wordMode 
   * @return {String} 
   */
  encodeQP: function( input, multibyte, wordMode ) {
    
    var pattern = ( !wordMode )
      ? /[\x3D]|[^\x09\x0D\x0A\x20-\x7E]/gm
      : /[\x3D\x5F\x3F]|[^\x21-\x7E]/gm
    
    input = input.replace( pattern, function( match ) {
      match = ( multibyte )
        ? encodeURIComponent( match )
        : escape( match )
      return match.replace( /%/g, '=' )
    })
    
    return ( !wordMode )
      ? input.replace( /(.{73}(?!\r\n))/g, "$1=\r\n" )
      : input
    
  },
  
  /**
   * Decodes a string from Quoted-printable format.
   * 
   * @param  {String}  input 
   * @param  {Boolean} multibyte 
   * @param  {Boolean} wordMode 
   * @return {String} 
   */
  decodeQP: function( input, multibyte, wordMode ) {
    
    if( !wordMode ) {
      input = input.replace( /[=]\r\n/gm, '' )
      input = input.replace( /[=]$/, '' )
    }
    else {
      input = input.replace( /_/g, ' ' )
    }
    
    input = input.replace( /[=]([A-F0-9]{2})/g, "%$1" )
    
    return ( multibyte )
      ? decodeURIComponent( input )
      : unescape( input )
    
  },
  
  /**
   * Encodes a string into mime encoded word format.
   * <http://en.wikipedia.org/wiki/MIME#Encoded-Word>
   * 
   * @param  {String} input 
   * @param  {String} type 
   * @param  {String} charset 
   * @return {String} 
   */
  encodeWord: function( input, type, charset ) {
    
    type = ( type )
      ? type.toUpperCase()
      : 'Q'
    
    if( type === 'B' ) {
      input = this.encodeBase64( input, charset )
    }
    
    input = this.encodeQP( input, charset, true )
    input = [ charset, type, input ].join( '?' )
    
    return '=?' + input + '?='
    
  },
  
  /**
   * Decodes a string from mime encoded word format.
   * @see #encodeWord()
   * 
   * @param  {String} input 
   * @return {String} 
   */
  decodeWord: function( input ) {
    
    var self = this
    
    return input.replace(
      /[=][?]([^?]+)[?]([a-z])[?]([^?]*)[?][=]/gi,
      function( match, charset, type, data ) {
        
        type = type.toUpperCase()
        data = self.decodeQP( data, charset, true )
        
        if( type === 'B' ) {
          data = self.decodeBase64( data, 'utf-8' )
        }
        
        return data
        
      }
    )
    
  },
  
  /**
   * Folds a long line according to the RFC 5322.
   * <http://tools.ietf.org/html/rfc5322#section-2.1.1>
   * 
   * @param  {String}  input 
   * @param  {Number}  maxLength 
   * @param  {Boolean} hardWrap 
   * @return {String} 
   */
  foldLine: function( input, maxLength, hardWrap ) {
    
    // RFC compliant default line length
    maxLength = maxLength || 78
    
    // We really don't need to fold this
    if( input.length <= maxLength )
      return input
    
    // Go into "hard wrap" mode if there's
    // no whitespace to fold on
    if( !/[\t ]/g.test( input ) )
      hardWrap = true
    
    var CRLF  = "\r\n"
    var lines = []
    
    if( hardWrap ) {
      var i = 0, max = maxLength - 3
      var c = (( input.length / max ) | 0 ) + 1
      for( ; i < c; i++ ) {
        lines.push( input.slice( i * max, i * max + max ) )
      }
    }
    else {
      // TODO
    }
    
    return lines.join( CRLF + ' ' ) + CRLF
    
  }
  
}

module.exports = new Mime
