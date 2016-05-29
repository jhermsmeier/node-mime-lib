var fs   = require( 'fs' );
var path = require( 'path' );
var typesData = require( './mime.types.json' );

/**
 * MIME constructor
 */
function MIME() {

  var self = this;

  this.types      = Object.create( null );
  this.extensions = Object.create( null );

  for ( var type in typesData ) {
    var exts = typesData[ type ];
    self.extensions[ type ] = exts;
    exts.forEach( function( ext ) {
        self.types[ ext ] = type;
    });
  }

  this.default = this.types[ 'bin' ];

}

/**
 * Iconv constructor
 * @type {Iconv}
 */
MIME.Iconv = require( 'iconv-lite' )

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
      return MIME.Iconv.encode( input, charset )
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
      return MIME.Iconv.decode( new Buffer( input, 'base64' ), charset )
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

    input.replace( /[=]([A-F0-9]{2})|(.|[\u0000-\uFFFF])/g, function( match, hex, chr ) {
      bytes.push( hex ? parseInt( hex, 16 ) : chr.charCodeAt( 0 ) )
    })

    return MIME.Iconv.decode( new Buffer( bytes ), charset )

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
  foldLine: require( 'foldline' ),

  /**
   * [urlEncode description]
   * @param  {String} input
   * @return {String}
   */
  urlEncode: function( input ) {

    var len = input.length
    var chr, out = ''

    function hex( number ) {
      return number.toString( 16 ).toUpperCase()
    }

    for( var i = 0; i < len; i++ ) {
      chr = input.charCodeAt( i )
      if( chr >= 0x41 && chr <= 0x5A ) {
        out = out + input[i]
      } else if( chr >= 0x61 && chr <= 0x7A ) {
        out = out + input[i]
      } else if( chr >= 0x30 && chr <= 0x39 ) {
        out = out + input[i]
      } else if( input[i].match( /[-_.!~*'()]/ ) ) {
        out = out + input[i]
      } else if( chr <= 0x007F ) {
        out = out + '%' + hex( chr )
      } else if( chr <= 0x07FF ) {
        out = out + '%' + hex( 0xC0 | (chr >>   6) )
        out = out + '%' + hex( 0x80 | (chr & 0x3F) )
      } else {
        out = out + '%' + hex( 0xE0 | (chr >> 12) )
        out = out + '%' + hex( 0x80 | ((chr >> 6) & 0x3F) )
        out = out + '%' + hex( 0x80 | (chr & 0x3F) )
      }
    }

    return out

  }

}

module.exports = new MIME
