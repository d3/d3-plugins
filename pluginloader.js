
;(function() {
  /* jshint node:true, asi:true, eqnull:true */
  "use strict";
  var has_require = typeof require !== 'undefined';

  var d3 = this.d3;
  if( typeof d3 === 'undefined' ) {
    if( has_require ) {
      d3 = require('d3');
    }
    else throw new Error('d3 plugins require d3');
  }

  var pluginloader = function(obj) {
    if (obj instanceof pluginloader) {
      return obj;
    }
    if (!(this instanceof pluginloader)) {
      return new pluginloader(obj);
    }
    this._wrapped = obj;
  };

  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = pluginloader;
    } else {
      exports.pluginloader = pluginloader;
    }
  }

  pluginloader.load = function(pluginname) {
    if ( has_require ) {
      require('./' + pluginname + '/' + pluginname);
    }
  }

}).call(this);
