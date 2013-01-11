function gringortenProjection() {
  var quincuncial = false,
      m = projectionMutator(gringorten),
      p = m(quincuncial);

  p.quincuncial = function(_) {
    if (!arguments.length) return quincuncial;
    return m(quincuncial = !!_);
  };

  return p;
}

function gringorten(quincuncial) {
  return function(λ, φ) {
    var cosφ = Math.cos(φ),
        x = Math.cos(λ) * cosφ,
        y = Math.sin(λ) * cosφ,
        z = Math.sin(φ);
    if (quincuncial) {
      λ = Math.atan2(y, -z) - π / 4;
      φ = asin(x);
    } else {
      λ = Math.atan2(z, x) + π / 2;
      φ = asin(-y);
    }
    while (λ < 0) λ += 2 * π;
    var nφ = φ < 0,
        df = ~~(λ / (π / 4));
    λ %= π / 2;
    var point = gringortenHexadecant(df & 1 ? π / 2 - λ : λ, Math.abs(φ)),
        x = point[0],
        y = point[1],
        t;
    if (quincuncial && nφ) y = -2 - y;
    if (df > 3) x = -x, y = -y;
    switch (df % 4) {
      case 1: x = -x; // fall through
      case 2: t = x; x = -y; y = t; break;
      case 3: y = -y; break;
    }
    if (!quincuncial && nφ) x = 2 - x;
    return quincuncial ? [(x - y) / Math.SQRT2, (x + y) / Math.SQRT2] : [x, y];
  };
}

function gringortenHexadecant(λ, φ) {
  if (φ === π / 2) return [0, 0];

  var sinφ = Math.sin(φ),
      r = sinφ * sinφ,
      r2 = r * r,
      j = 1 + r2,
      k = 1 + 3 * r2,
      q = 1 - r2,
      z = asin(1 / Math.sqrt(j)),
      v = q + r * j * z,
      p2 = (1 - sinφ) / v,
      p = Math.sqrt(p2),
      a2 = p2 * j,
      a = Math.sqrt(a2),
      h = p * q;
  if (λ === 0) return [0, -(h + r * a)];

  var cosφ = Math.cos(φ),
      secφ = 1 / cosφ,
      drdφ = 2 * sinφ * cosφ,
      dvdφ = (-3 * r + z * k) * drdφ,
      dp2dφ = (-v * cosφ - (1 - sinφ) * dvdφ) / (v * v),
      dpdφ = (.5 * dp2dφ) / p,
      dhdφ = q * dpdφ - 2 * r * p * drdφ,
      dra2dφ = r * j * dp2dφ + p2 * k * drdφ,
      μ = -secφ * drdφ,
      ν = -secφ * dra2dφ,
      ζ = -2 * secφ * dhdφ,
      Λ = 4 * λ / π;

  if (λ > .222 * π || φ < π / 4 && λ > .175 * π) {
    // Slower but accurate bisection method.
    var x = (h + r * asqrt(a2 * (1 + r2) - h * h)) / (1 + r2);
    if (λ > π / 4) return [x, x];

    var x1 = x,
        x0 = .5 * x,
        i = -1;
    x = .5 * (x0 + x1);
    do {
      var g = Math.sqrt(a2 - x * x),
          f = (x * (ζ + μ * g) + ν * asin(x / a)) - Λ;
      if (!f) break;
      if (f < 0) x0 = x;
      else x1 = x;
      x = .5 * (x0 + x1);
    } while (++i < 50 && Math.abs(x1 - x0) > ε);
  } else {
    // Newton-Raphson.
    for (var x = ε, i = 0; i < 25; i++) {
      var x2 = x * x,
          g = asqrt(a2 - x2),
          ζμg = ζ + μ * g,
          f = x * ζμg + ν * asin(x / a) - Λ,
          df = ζμg + (ν - μ * x2) / g,
          dx = g ? -f / df : 0;
      x += dx;
      if (Math.abs(dx) < ε) break;
    }
  }
  return [x, -h - r * asqrt(a2 - x * x)];
}

(d3.geo.gringorten = gringortenProjection).raw = gringorten;
