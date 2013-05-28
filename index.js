
require('query-qwery'); //old browser support for query
var query = require('query');
var dataControlParser = require('data-control-parser');

/**
 * Find all the nodes with [attr] set, and try to load and intialize their
 * components. Nodes that are found are parsed by data-control-parser, and the
 * associated component is `require`d and then called with (node, config) as
 * the arguments.
 *
 * parent: the scope in which to query. Defaults to document
 * options:
 *    onerror: function to call with error messages. defaults to `console.error`
 *    attr:    the attribute to look for. Defaults to `data-comp`
 *    require: function for loading the components. defaults to the require
 *             included in the component build
 */
module.exports = function(parent, options){
  parent = parent || document;
  options = options || {};
  var attr = options.attr || 'data-comp'
    , comps = query.all('[' + attr + ']', parent)
    , onerror = options.onerror || console.error
    , require = options.require || require
    , componentName
    , component
    , cfg;
  for (var i=0; i<comps.length; i++) {
    componentName = comps[i].getAttribute(attr);
    try {
      component = require(componentName);
    } catch (ex) {
      onerror("Failed to load component definition '" + componentName + "': " + ex);
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

