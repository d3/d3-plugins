function vanDerGrinten2(λ, φ) {
  if (Math.abs(φ) < ε) return [λ, 0];
  var sinθ = Math.abs(2 * φ / π),
      θ = asin(sinθ);
  if (Math.abs(λ) < ε || Math.abs(Math.abs(φ) - π / 2) < ε) return [0, sgn(φ) * π * Math.tan(θ / 2)];
  var cosθ = Math.cos(θ),
      A = Math.abs(π / λ - λ / π) / 2,
      A2 = A * A,
      x1 = cosθ * (Math.sqrt(1 + A2) - A * cosθ) / (1 + A2 * sinθ * sinθ);
  return [
    sgn(λ) * π * x1,
    sgn(φ) * π * asqrt(1 - x1 * (2 * A + x1))
  ];
}

(d3.geo.vanDerGrinten2 = function() { return projection(vanDerGrinten2); }).raw = vanDerGrinten2;
