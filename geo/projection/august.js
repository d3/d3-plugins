function august(λ, φ) {
  var tanφ = Math.tan(φ / 2),
      k = 1 - tanφ * tanφ,
      c = 1 + k * Math.cos(λ /= 2),
      x = Math.sin(λ) * k / c,
      y = tanφ / c,
      x2 = x * x,
      y2 = y * y;
  return [
    4 / 3 * x * (3 + x2 - 3 * y2),
    4 / 3 * y * (3 + 3 * x2 - y2)
  ];
}

(d3.geo.august = function() { return projection(august); }).raw = august;
