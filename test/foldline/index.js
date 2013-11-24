
var assert = require( 'assert' )
var mime = require( '../../' )

module.exports = {
  
  'simple soft wrap': function() {
    
    var output = mime.foldLine([
      'This string should be way longer than 78 chars.',
      'Which should trigger line folding. Let\'s see, if this works...'
    ].join( ' ' ))
    
    console.log( '' )
    console.log( output )
    assert.equal( output, [
      'This string should be way longer than 78 chars. Which should trigger line',
      ' folding. Let\'s see, if this works...'
    ].join( '\r\n ' ))
    
  },
  
  'soft wrap /w switch to hard wrap': function() {
    
    var output = mime.foldLine([
      'This string should be way longer than 78 chars.',
      'Which should trigger line folding. Let\'s see, if this works...',
      'f97c055cbb09fd2c4414e698362119866740e271f97c055cbb09fd2c4414e698362119866740e271',
      'f97c055cbb09fd2c4414e698362119866740e271f97c055cbb09fd2c4414e698362119866740e271'
    ].join( ' ' ))
    
    console.log( '' )
    console.log( output )
    assert.equal( output, [
      'This string should be way longer than 78 chars. Which should trigger line',
      '  folding. Let\'s see, if this works...',
      ' f97c055cbb09fd2c4414e698362119866740e271f97c055cbb09fd2c4414e69836211986674',
      ' 0e271 f97c055cbb09fd2c4414e698362119866740e271f97c055cbb09fd2c4414e69836211',
      ' 9866740e271'
    ].join( '\r\n' ))
    
  },
  
  'forced hard wrap': function() {
    
    var output = mime.foldLine([
      'This string should be way longer than 78 chars.',
      'Which should trigger line folding. Let\'s see, if this works...',
      'f97c055cbb09fd2c4414e698362119866740e271f97c055cbb09fd2c4414e698362119866740e271',
      'f97c055cbb09fd2c4414e698362119866740e271f97c055cbb09fd2c4414e698362119866740e271'
    ].join( ' ' ), 0, true )
    
    console.log( '' )
    console.log( output )
    assert.equal( output, [
      'This string should be way longer than 78 chars. Which should trigger line f',
      ' olding. Let\'s see, if this works... f97c055cbb09fd2c4414e698362119866740e27',
      ' 1f97c055cbb09fd2c4414e698362119866740e271 f97c055cbb09fd2c4414e698362119866',
      ' 740e271f97c055cbb09fd2c4414e698362119866740e271'
    ].join( '\r\n' ))
    
  },
  
  'custom maxLength': function() {
    
    var output = mime.foldLine( 'abcde', 4 )
    
    console.log( '' )
    console.log( output )
    
  }
  
}
