# MIME Library
[![npm](https://img.shields.io/npm/v/mime-lib.svg?style=flat-square)](https://npmjs.com/mime-lib)
[![npm](https://img.shields.io/npm/l/mime-lib.svg?style=flat-square)](https://npmjs.com/mime-lib)
[![npm downloads](https://img.shields.io/npm/dm/mime-lib.svg?style=flat-square)](https://npmjs.com/mime-lib)
[![build status](https://img.shields.io/travis/jhermsmeier/node-mime-lib.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-mime-lib)

## Install via [npm](https://npmjs.com/package/mime-lib)

```sh
$ npm install mime-lib
```

## Usage


### MIME type lookup

```javascript
mime.type('html')        // => text/html
mime.type('mp4')         // => video/mp4
mime.type('nonexistant') // => application/octet-stream
```


### MIME extension lookup

```javascript
mime.extension('text/html')   // => [ 'htm', 'html' ]
mime.extension('nonexistant') // => undefined
```


### mime.encodeBase64( input, charset )

> *String | Buffer* __input__
> *String* __charset__ (optional)

Base64 encodes a buffer or string.
Returns string.


### mime.decodeBase64( input, charset )

> *String* __input__
> *String* __charset__ (optional)

Decodes a base64 encoded string.
Returns string or buffer.


### mime.encodeQP( input, multibyte, wordMode )

> *String* __input__
> *Boolean* __multibyte__ (optional)
> *Boolean* __wordMode__ (optional)

Encodes a string into Quoted-printable format.
Returns string.


### mime.decodeQP( input, multibyte, wordMode )

> *String* __input__
> *Boolean* __multibyte__ (optional)
> *Boolean* __wordMode__ (optional)

Decodes a string from Quoted-printable format.
Returns string.


### mime.encodeWord( input, type, charset )

> *String* __input__
> *String* __type__ (optional)
> *String* __charset__ (optional)

Encodes a string into mime encoded
[word format](http://en.wikipedia.org/wiki/MIME#Encoded-Word).
Returns string.


### mime.decodeWord( input )

> *String* __input__

Decodes a string from mime encoded word format.
Returns string.


### mime.foldLine( input, maxLength, hardWrap )

> *String* __input__
> *Number* __maxLength__ (optional)
> *Boolean* __hardWrap__ (optional)

Folds a long line according to the
[RFC 5322](http://tools.ietf.org/html/rfc5322#section-2.1.1).
Returns string.
See [jhermsmeier/node-foldline](https://github.com/jhermsmeier/node-foldline)
