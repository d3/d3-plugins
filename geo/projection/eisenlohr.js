// @import august

function eisenlohr(λ, φ) {
  var s0 = Math.sin(λ /= 2),
      c0 = Math.cos(λ),
      k = Math.sqrt(Math.cos(φ)),
      c1 = Math.cos(φ /= 2),
      t = Math.sin(φ) / (c1 + Math.SQRT2 * c0 * k),
      c = Math.sqrt(2 / (1 + t * t)),
      v = Math.sqrt((Math.SQRT2 * c1 + (c0 + s0) * k) / (Math.SQRT2 * c1 + (c0 - s0) * k));
  return [
    eisenlohrK * (c * (v - 1 / v) - 2 * Math.log(v)),
    eisenlohrK * (c * t * (v + 1 / v) - 2 * Math.atan(t))
  ];
}

eisenlohr.invert = function(x, y) {
  var p = d3.geo.august.raw.invert(x, y);
  if (!p) return null;
  var λ = p[0],
      φ = p[1],
      i = 50,
      sqrt2 = Math.SQRT2;
  if (Math.abs(φ) > 89 * radians) λ = sgn(λ) * π;
  x /= eisenlohrK, y /= eisenlohrK;
  do {
    var _0 = λ / 2,
        _1 = φ / 2,
        s0 = Math.sin(_0),
        c0 = Math.cos(_0),
        s1 = Math.sin(_1),
        c1 = Math.cos(_1),
        sin1 = Math.sin(φ),
        cos1 = Math.cos(φ),

        k = Math.sqrt(cos1),
        t = s1 / (c1 + sqrt2 * c0 * k),
        t2 = t * t,
        c = Math.sqrt(2 / (1 + t2)),
        v0 = (Math.SQRT2 * c1 + (c0 + s0) * k),
        v1 = (Math.SQRT2 * c1 + (c0 - s0) * k),
        v = Math.sqrt(v0 / v1),

        fx = c * (v - 1 / v) - 2 * Math.log(v) - x,
        fy = c * t * (v + 1 / v) - 2 * Math.atan(t) - y,

        x0 = c0 + s0,
        x1 = t2 + 1,
        x2 = c0 - s0,
        x3 = v + 1 / v,
        x4 = c0 * k * sqrt2 + c1,
        x5 = c1 * sqrt2 + k * x0,
        x6 = c0 * sin1 * sqrt2 / k + s1,
        x7 = c1 * sqrt2 + k * x2,
        x8 = s1 * sqrt2 + sin1 * x0 / k,
        x9 = x7 * x7,
        x10 = s1 * sqrt2 + sin1 * x2 / k,
        x11 = 2 * cos1 * t + t2 * x6,
        x12 = -x10 * x5 / x9 + x8 / x7,
        x13 = 2 * cos1,
        x14 = k / 2,
        x15 = -s0,
        x16 = s1 * sqrt2,
        x17 = -1 / v,
        x18 = sin1 / k,
        x19 = k * x0,
        x20 = c * x3,
        x21 = k * x2,
        x22 = k * x3,
        x23 = t2 / x1 * Math.sqrt(t2 / x1),
        x24 = -1 / x1,
        x25 = 2 / x4,
        x26 = 2 * x25,
        x27 = t * x6,
        x28 = -1 / x7,
        x29 = (v - 1 / v) / x4,
        x30 = x5 / x9,
        x31 = -x28 * x5,
        x32 = c * x7 / x5,
        x33 = v * (x19 * x30 - x21 * x28),

        δxδλ = k * x15 * x23 * x29 - x14 * (x0 * x31 + x2) / x5 + x32 * (-x17 * (x19 * x30 - x21 * x28) + x33) / 4,
        δxδφ = c * x11 * x24 * x29 / 2 + x32 * (-v * x12 + x12 * x17) / 4 - (x10 * x31 - x8) / (2 * x5),
        δyδλ = t * (-k * sqrt2 * x15 * x24 * x26 + x15 * x22 * x23 * x26 + x32 * (-4 * x17 * (k * x28 * (c0 / 4 + x15 / 4) - x14 * x30 * (c0 / 2 - x15 / 2)) + x33) - x15 * x22 * x26 / Math.sqrt(x1)) / 4,
        δyδφ = t * x11 * x20 * x24 * x25 / 4 + t * x32 * (4 * v * (x28 * (x0 * x18 / 4 + x16 / 4) + x30 * (x16 / 2 + x18 * x2 / 2) / 2) - x12 * x17) / 4 + x13 * x20 * x25 / 4 + x20 * x25 * x27 / 4 - x24 * (-4 * x13 - 4 * x27) / (4 * x4),

        denominator = δxδφ * δyδλ - δyδφ * δxδλ,
        δλ = (fy * δxδφ - fx * δyδφ) / denominator,
        δφ = (fx * δyδλ - fy * δxδλ) / denominator;
    λ = Math.max(-π, Math.min(π, λ - δλ));
    φ = Math.max(-π / 2, Math.min(π / 2, φ - δφ));
  } while ((Math.abs(δλ) > ε || Math.abs(δφ) > ε2) && --i > 0);
  return Math.abs(Math.abs(φ) - π / 2) < ε
      ? [0, φ]
      : i && [λ, φ];
};

var eisenlohrK = 3 + 2 * Math.SQRT2;

(d3.geo.eisenlohr = function() { return projection(eisenlohr); }).raw = eisenlohr;
