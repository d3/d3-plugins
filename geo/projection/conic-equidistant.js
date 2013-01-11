// @import parallel2

function conicEquidistant(φ0, φ1) {
  var cosφ0 = Math.cos(φ0),
      n = (cosφ0 - Math.cos(φ1)) / (φ1 - φ0),
      G = cosφ0 / n + φ0;

  function forward(λ, φ) {
    var ρ = G - φ;
    return [
      ρ * Math.sin(n * λ),
      G - ρ * Math.cos(n * λ)
    ];
  }

  forward.invert = function(x, y) {
    var ρ0_y = G - y;
    return [
      Math.atan2(x, ρ0_y) / n,
      G - sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y)
    ];
  };

  return forward;
}

(d3.geo.conicEquidistant = function() { return parallel2Projection(conicEquidistant); }).raw = conicEquidistant;
