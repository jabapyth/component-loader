
[![Build Status](https://travis-ci.org/jabapyth/component-loader.png?branch=master)](https://travis-ci.org/jabapyth/component-loader)

# component-loader

 Find all the nodes with [attr] set, and try to load and intialize their
 components. Nodes that are found are parsed by data-control-parser, and the
 associated component is `require`d and then called with (node, config) as
 the arguments.

## Installation

    $ component install fs-components/control-loader

## API

### componentLoader(require, parent, options)

- require: function for loading the components.
- parent: the scope in which to query. Defaults to document
- options:

  -  onerror: function to call with error messages. defaults to `console.error`
  -  attr:    the attribute to look for. Defaults to `data-comp`

   

