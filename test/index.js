
module.exports = {

  'Quoted Printable': {
    'Encode': require( './qp/encode' ),
    'Decode': require( './qp/decode' ),
    'Encode MIME Word': require( './qp/encode_word' ),
    'Decode MIME Word': require( './qp/decode_word' )
  },

  'URI': {
    'Encode': require( './uri/encode' )
  },

  'Types': require( './types' )

}
