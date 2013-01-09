// @import parallel2

function conicConformal(φ0, φ1) {
  var cosφ0 = Math.cos(φ0),
      t = function(φ) { return Math.tan(π / 4 + φ / 2); },
      n = Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)),
      F = cosφ0 * Math.pow(t(φ0), n) / n;

  function forward(λ, φ) {
    var ρ = Math.abs(Math.abs(φ) - π / 2) < ε ? 0 : F / Math.pow(t(φ), n);
    return [
      ρ * Math.sin(n * λ),
      F - ρ * Math.cos(n * λ)
    ];
  }

  forward.invert = function(x, y) {
    var ρ0_y = F - y,
        ρ = sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
    return [
      Math.atan2(x, ρ0_y) / n,
      2 * Math.atan(Math.pow(F / ρ, 1 / n)) - π / 2
    ];
  };

  return forward;
}

(d3.geo.conicConformal = function() { return parallel2Projection(conicConformal); }).raw = conicConformal;
