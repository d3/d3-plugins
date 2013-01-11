function eckert4(λ, φ) {
  var k = (2 + π / 2) * Math.sin(φ);
  φ /= 2;
  for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
    var cosφ = Math.cos(φ);
    φ -= δ = (φ + Math.sin(φ) * (cosφ + 2) - k) / (2 * cosφ * (1 + cosφ));
  }
  return [
    2 / Math.sqrt(π * (4 + π)) * λ * (1 + Math.cos(φ)),
    2 * Math.sqrt(π / (4 + π)) * Math.sin(φ)
  ];
}

eckert4.invert = function(x, y) {
  var j = 2 * Math.sqrt(π / (4 + π)),
      k = asin(y / cy),
      c = Math.cos(k);
  return [
    x / (2 / Math.sqrt(π * (4 + π)) * (1 + c)),
    asin((k + y / j * (c + 2)) / (2 + π / 2))
  ];
};

(d3.geo.eckert4 = function() { return projection(eckert4); }).raw = eckert4;
