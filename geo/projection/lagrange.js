function lagrange(n) {
  return function(λ, φ) {
    if (Math.abs(Math.abs(φ) - π / 2) < ε) return [0, φ < 0 ? -2 : 2];
    var sinφ = Math.sin(φ),
        v = Math.pow((1 + sinφ) / (1 - sinφ), n / 2),
        c = .5 * (v + 1 / v) + Math.cos(λ *= n);
    return [
      2 * Math.sin(λ) / c,
      (v - 1 / v) / c
    ];
  };
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
