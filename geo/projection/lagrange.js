function lagrange(n) {
  function forward(λ, φ) {
    if (Math.abs(Math.abs(φ) - π / 2) < ε) return [0, φ < 0 ? -2 : 2];
    var sinφ = Math.sin(φ),
        v = Math.pow((1 + sinφ) / (1 - sinφ), n / 2),
        c = .5 * (v + 1 / v) + Math.cos(λ *= n);
    return [
      2 * Math.sin(λ) / c,
      (v - 1 / v) / c
    ];
  }

  forward.invert = function(x, y) {
    var y0 = Math.abs(y);
    if (Math.abs(y0 - 2) < ε) return x ? null : [0, y < 0 ? -π / 2 : π / 2];
    if (y0 > 2) return null;
    var v = (y + 2) / (2 - y),
        v2n = Math.pow(v, 2 / n),
        c = .5 * (v + 1 / v) + Math.cos(n * x / 2),
        φ = asin((v2n - 1) / (v2n + 1)),
        λ = asin(c * x / 2) / n,
        i = 50;
    do {
      var sinφ = Math.sin(φ),
          cosφ = Math.cos(φ),
          nλ = n * λ,
          cosnλ = Math.cos(nλ),
          sinnλ = Math.sin(nλ),
          u = (1 + sinφ) / (1 - sinφ),
          v = Math.pow(u, n / 2),
          v0 = v + 1 / v,
          v1 = v - 1 / v,
          c = .5 * v0 + cosnλ;
          c2 = c * c,
          A = (1 + u) * (cosφ / (1 - sinφ)),
          fx = 2 * sinnλ / c - x,
          fy = v1 / c - y,
          δxδλ = 2 * n * (sinnλ * sinnλ / c2 + cosnλ / c),
          δxδφ = -sinnλ * n * A * v1 / (2 * u * c2),
          δyδλ = n * sinnλ * v1 / c2,
          δyδφ = n * A / (2 * u * c) * (v0 - .5 * v1 * v1 / c),
          denominator = δxδφ * δyδλ - δyδφ * δxδλ;
      if (!denominator) break;
      var δλ = (fy * δxδφ - fx * δyδφ) / denominator,
          δφ = (fx * δyδλ - fy * δxδλ) / denominator;
      λ -= δλ, φ -= δφ;
    } while ((Math.abs(δλ) > ε || Math.abs(δφ) > ε) && --i > 0);
    return [λ, φ];
  };

  return forward;
}

function lagrangeProjection() {
  var n = .5,
      m = projectionMutator(lagrange),
      p = m(n);

  p.spacing = function(_) {
    if (!arguments.length) return n;
    return m(n = +_);
  };

  return p;
}

(d3.geo.lagrange = lagrangeProjection).raw = lagrange;
