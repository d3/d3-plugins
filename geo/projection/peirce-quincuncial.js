// @import guyou

function peirceQuincuncial(λ, φ) {
  var k_ = (Math.SQRT2 - 1) / (Math.SQRT2 + 1),
      k = Math.sqrt(1 - k_ * k_),
      K = ellipticF(π / 2, k * k);

  var t = Math.abs(λ) < π / 2,
      p = guyou(λ + (λ < -π / 2 ? 1.5 : -.5) * π, φ);

  p[0] += (t ? .5 : -.5) * K;

  var x = (p[0] - p[1]) / Math.SQRT2,
      y = (p[0] + p[1]) / Math.SQRT2;

  if (t) return [x, y];

  var d = K * Math.SQRT1_2,
      s = x > 0 ^ y > 0 ? -1 : 1;

  return [s * x - sgn(y) * d, s * y - sgn(x) * d];
}

(d3.geo.peirceQuincuncial = function() { return projection(peirceQuincuncial).rotate([-90, -90, 45]).clipAngle(180 - 1e-6); }).raw = peirceQuincuncial;
