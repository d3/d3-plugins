function littrow(λ, φ) {
  return [
    Math.sin(λ) / Math.cos(φ),
    Math.tan(φ) * Math.cos(λ)
  ];
}

(d3.geo.littrow = function() { return projection(littrow); }).raw = littrow;
