function vanDerGrinten3(λ, φ) {
  if (Math.abs(φ) < ε) return [λ, 0];
  var sinθ = Math.abs(2 * φ / π),
      θ = asin(sinθ);
  if (Math.abs(λ) < ε || Math.abs(Math.abs(φ) - π / 2) < ε) return [0, sgn(φ) * π * Math.tan(θ / 2)];
  var cosθ = Math.cos(θ),
      A = Math.abs(π / λ - λ / π) / 2,
      y1 = sinθ / (1 + cosθ);
  return [
    sgn(λ) * π * (asqrt(A * A + 1 - y1 * y1) - A),
    sgn(φ) * π * y1
  ];
}

(d3.geo.vanDerGrinten3 = function() { return projection(vanDerGrinten3); }).raw = vanDerGrinten3;
