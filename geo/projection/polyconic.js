function polyconic(λ, φ) {
  if (Math.abs(φ) < ε) return [λ, 0];
  var tanφ = Math.tan(φ),
      k = λ * Math.sin(φ);
  return [
    Math.sin(k) / tanφ,
    φ + (1 - Math.cos(k)) / tanφ
  ];
}

polyconic.invert = function(x, y) {
  if (Math.abs(y) < ε) return [x, 0];
  var k = x * x + y * y,
      φ = y;
  for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
    var tanφ = Math.tan(φ);
    φ -= δ = (y * (φ * tanφ + 1) - φ - .5 * (φ * φ + k) * tanφ) / ((φ - y) / tanφ - 1);
  }
  return [
    asin(x * Math.tan(φ)) / Math.sin(φ),
    φ
  ];
};

(d3.geo.polyconic = function() { return projection(polyconic); }).raw = polyconic;
