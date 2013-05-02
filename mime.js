
/**
 * MIME constructor
 */
function MIME() {
  
  var self = this
  var fs   = require( 'fs' )
  var path = require( 'path' )
  
  this.types      = Object.create( null )
  this.extensions = Object.create( null )
  this.default    = this.types[ 'bin' ]
  
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
 * Iconv constructor
 * @type {Iconv}
 */
MIME.Iconv = require( 'iconv' ).Iconv

/**
 * MIME prototype
 * @type {Object}
 */
MIME.prototype = {
  
  /**
   * Looks up MIME type by extension.
   * 
   * @param  {String} extension
   * @return {String} MIME type
   */
  type: function( extension ) {
    return this.types[ extension ] || this.default
  },
  
  /**
   * Looks up file extensions by MIME type.
   * 
   * @param  {String} type MIME type
   * @return {Array}  File extensions
   */
  extension: function( type ) {
    return this.extensions[ type ]
  },
  
  /**
   * Base64 encodes a buffer or string.
   * 
   * @param  {String|Buffer} input   
   * @param  {String} charset 
   * @return {String} 
   */
  encodeBase64: function( input, charset ) {
    if( charset && !Buffer.isBuffer( input ) ) {
      return new MIME.Iconv( 'UTF8', charset+'//TRANSLIT//IGNORE' )
        .convert( input )
        .toString( 'base64' )
    } else {
      return Buffer.isBuffer( input )
        ? input.toString( 'base64' )
        : new Buffer( input ).toString( 'base64' )
    }
  },
  
  /**
   * Decodes a base64 encoded string.
   * 
   * @param  {String} input   
   * @param  {String} charset 
   * @return {String|Buffer} 
   */
  decodeBase64: function( input, charset ) {
    if( charset ) {
      return new MIME.Iconv( 'UTF8', charset + '//TRANSLIT//IGNORE' )
        .convert( new Buffer( input, 'base64' ) )
    } else {
      return new Buffer( input, 'base64' )
    }
  },
  
  /**
   * Encodes a string into Quoted-printable format.
   * 
   * @param  {String}  input 
   * @param  {Boolean} wordMode 
   * @return {String} 
   */
  encodeQP: function( input, wordMode ) {
    
    var bytes = !Buffer.isBuffer( input )
      ? new Buffer( input ) : input
    
    var chr, out = '', len = bytes.length
    
    for( var i = 0; i < len; i++ ) {
      chr = bytes[i]
      if( wordMode ) {
        // if matches /[\x3D]|[^\x09\x0D\x0A\x20-\x7E]/gm
        out = chr !== 0x3D && ( chr >= 0x20 && chr <= 0x007E ) || ( chr === 0x09 || chr === 0x0D || chr === 0x0A )
          ? out + String.fromCharCode( chr )
          : out + '=' + chr.toString( 16 ).toUpperCase()
      } else {
        // if matches /[\x3D\x5F\x3F]|[^\x21-\x7E]/gm
        out = (chr !== 0x3D && chr !== 0x5F && chr !== 0x3F) && (chr >= 0x21 && chr <= 0x007E)
          ? out + String.fromCharCode( chr )
          : out + '=' + chr.toString( 16 ).toUpperCase()
      }
    }
    
    return out
    
  },
  
  /**
   * Decodes a string from Quoted-printable format.
   * 
   * @param  {String}  input 
   * @param  {Boolean} multibyte 
   * @param  {Boolean} wordMode 
   * @return {String} 
   */
  decodeQP: function( input, charset, wordMode ) {
    
    var bytes = []
    charset = charset || 'utf8'
    
    if( !wordMode ) {
      input = input.replace( /[=]\r?\n/gm, '' )
      input = input.replace( /[=]$/, '' )
    } else {
      input = input.replace( /_/g, ' ' )
    }
    
    input.replace( /[=]([A-F0-9]{2})|(.)/g, function( match, hex, chr ) {
      bytes.push( hex ? parseInt( hex, 16 ) : chr.charCodeAt( 0 ) )
    })
    
    return new MIME.Iconv( charset, 'UTF8//TRANSLIT//IGNORE' )
      .convert( new Buffer( bytes ) )
      .toString()
    
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
    
    type = ( type || 'Q' ).toUpperCase()
    charset = ( charset || 'utf-8' ).toUpperCase()
    
    if( type === 'B' ) {
      input = this.encodeBase64( input, charset )
    }
    
    input = this.encodeQP( input, true )
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
          data = self.decodeBase64( data, charset )
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
    if( !/\t|\s/g.test( input ) )
      hardWrap = true
    
    var CRLF  = '\r\n'
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

module.exports = new MIME
