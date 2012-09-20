(function() {
  d3.urlencode = function(name, value) {
    var array = [];
    d3_arraySubclass(array, d3_urlencodePrototype);
    return arguments.length ? array.and(name, value) : array;
  };

  d3.urlencode.type = "application/x-www-form-urlencoded;charset=utf-8";

  var d3_arraySubclass = [].__proto__?

  // Until ECMAScript supports array subclassing, prototype injection works well.
  function(array, prototype) {
    array.__proto__ = prototype;
  }:

  // And if your browser doesn't support __proto__, we'll use direct extension.
  function(array, prototype) {
    for (var property in prototype) array[property] = prototype[property];
  };

  var d3_urlencodePrototype = d3.urlencode.prototype = [];

  d3_urlencodePrototype.and = function(name, value) {
    name = d3_urlencode(name);
    this.push(value == null ? name : name + "=" + d3_urlencode(value));
    return this;
  };

  d3_urlencodePrototype.toString = function() {
    return this.join("&");
  };

  function d3_urlencode(value) {
    return encodeURIComponent(value).replace(/%20/g, "+");
  }
})();
