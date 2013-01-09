function vanDerGrinten4(λ, φ) {
  if (!φ) return [λ, 0];
  var φ0 = Math.abs(φ);
  if (!λ || φ0 === π / 2) return [0, φ];
  var t,
      B = 2 * φ0 / π,
      B2 = B * B,
      C = (8 * B - B2 * (B2 + 2) - 5) / (2 * B2 * (B - 1)),
      C2 = C * C,
      BC = B * C,
      B_C2 = B2 + C2 + 2 * BC,
      D = sgn(Math.abs(λ) - π / 2) * Math.sqrt((t = (t = 2 * λ / π) + 1 / t) * t - 4),
      D2 = D * D,
      F = B_C2 * (B2 + C2 * D2 - 1) + (1 - B2) * (B2 * ((t = B + 3 * C) * t + 4 * C2) + 12 * BC * C2 + 4 * C2 * C2),
      x1 = (D * (B_C2 + C2 - 1) + 2 * Math.sqrt(F)) / (4 * B_C2 + D2);
  return [
    sgn(λ) * π * x1 / 2,
    sgn(φ) * π / 2 * Math.sqrt(1 + D * Math.abs(x1) - x1 * x1)
  ];
}

(d3.geo.vanDerGrinten4 = function() { return projection(vanDerGrinten4); }).raw = vanDerGrinten4;
