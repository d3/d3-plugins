(function(d3) {
  var cie = d3.cie = {};

  cie.lab = function(l, a, b) {
    // TODO
  };

  cie.lch = function(l, c, h) {
    // TODO
  };

  cie.interpolateLab = function(a, b) {
    // TODO
  };

  cie.interpolateLch = function(a, b) {
    // TODO
  };

  function cie_Lab(l, a, b) {
    this.l = l;
    this.a = a;
    this.b = b;
  }

  cie_Lab.prototype.rgb = function() {
    // TODO
  };

  cie_Lab.prototype.toString = function() {
    // TODO
  };

  function cie_Lcb(l, c, h) {
    this.l = l;
    this.c = c;
    this.h = h;
  }

  cie_Lch.prototype.rgb = function() {
    // TODO
  };

  cie_Lch.prototype.toString = function() {
    // TODO
  };
})(d3);
