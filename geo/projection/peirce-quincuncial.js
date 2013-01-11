// @import guyou

function peirceQuincuncial(λ, φ) {
  var t = Math.abs(λ) < π / 2,
      p = guyou(t ? λ : -sgn(λ) * (π - Math.abs(λ)), φ),
      x = p[0] / Math.SQRT2 - p[1] / Math.SQRT2,
      y = p[1] / Math.SQRT2 + p[0] / Math.SQRT2;
  if (t) return [x, y];
  var d = 2 * 1.311028777082283, // TODO unobfuscate
      s = (x > 0) ^ (y > 0) ? -1 : 1;
  return [s * x - sgn(y) * d, s * y - sgn(x) * d];
}

(d3.geo.peirceQuincuncial = function() { return projection(peirceQuincuncial).rotate([-90, -90, 45]).clipAngle(180 - 1e-6); }).raw = peirceQuincuncial;
