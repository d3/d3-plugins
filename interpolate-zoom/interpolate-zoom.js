(function() {

var ρ = Math.SQRT2,
    ρ2 = 2,
    ρ4 = 4;

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]
d3.interpolateZoom = function(p0, p1) {
  var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
      ux1 = p1[0], uy1 = p1[1], w1 = p1[2];

  var dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      d1 = Math.sqrt(d2),
      b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1),
      b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1),
      r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
      r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1),
      dr = r1 - r0,
      S = (dr || Math.log(w1 / w0)) / ρ;

  function interpolate(t) {
    var s = t * S;
    if (dr) {
      // General case.
      var coshr0 = cosh(r0),
          u = w0 / (ρ2 * d1) * (coshr0 * tanh(ρ * s + r0) - sinh(r0));
      return [
        ux0 + u * dx,
        uy0 + u * dy,
        w0 * coshr0 / cosh(ρ * s + r0)
      ];
    }
    // Special case for u0 ~= u1.
    return [
      ux0 + t * dx,
      uy0 + t * dy,
      w0 * Math.exp(ρ * s)
    ];
  }

  interpolate.duration = S * 1000;

  return interpolate;
};

function cosh(x) {
  return (Math.exp(x) + Math.exp(-x)) / 2;
}

function sinh(x) {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}

function tanh(x) {
  return sinh(x) / cosh(x);
}

})();
