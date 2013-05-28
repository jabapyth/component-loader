
require('query-qwery'); //old browser support for query
var query = require('query');
var dataControlParser = require('data-control-parser');

/**
 * Find all the nodes with [attr] set, and try to load and intialize their
 * components. Nodes that are found are parsed by data-control-parser, and the
 * associated component is `require`d and then called with (node, config) as
 * the arguments.
 *
 * require: function for loading the components.
 * parent: the scope in which to query. Defaults to document
 * options:
 *    onerror: function to call with error messages. defaults to `console.error`
 *    attr:    the attribute to look for. Defaults to `data-comp`
 */
module.exports = function(require, parent, options){
  if (!require) {
    throw new Error('missing arguments');
  }
  parent = parent || document;
  options = options || {};
  var attr = options.attr || 'data-comp'
    , comps = query.all('[' + attr + ']', parent)
    , onerror = options.onerror || function(){ console.error.apply(console, arguments); }
    , componentName
    , component
    , cfg;
  for (var i=0; i<comps.length; i++) {
    componentName = comps[i].getAttribute(attr);
    try {
      component = require(componentName);
    } catch (ex) {
      onerror("Failed to load component definition '" + componentName + "': ", ex);
      continue;
    }
    cfg = dataControlParser(comps[i], attr);
    if (!cfg) {
      onerror('Failed to parse component node', comps[i]);
      continue;
    }
    if (!component(cfg.container, cfg)) {
      onerror('Component "' + componentName + '" failed to initialize');
    }
  }
}

