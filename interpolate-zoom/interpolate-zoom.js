(function() {

var ρ = Math.SQRT2,
    ρ2 = 2,
    ρ4 = 4;

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]
d3.interpolateZoom = function(p0, p1) {
  var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
      ux1 = p1[0], uy1 = p1[1], w1 = p1[2];
  return ux0 === ux1 && uy0 === uy1
      ? interpolate1(ux0, uy0, w0, w1)
      : interpolate2(ux0, uy0, ux1, uy1, w0, w1);
};

// Special case for u0 = u1.
function interpolate1(ux0, uy0, w0, w1) {
  var S = Math.abs(Math.log(w1 / w0)) / ρ,
      k = w1 < w0 ? -1 : 1;

  function interpolate(t) {
    var s = t * S;
    return [
      ux0,
      uy0,
      w0 * Math.exp(k * ρ * s)
    ];
  }

  interpolate.duration = S * 1000;

  return interpolate;
};

// General case.
function interpolate2(ux0, uy0, ux1, uy1, w0, w1) {
  var dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      d1 = Math.sqrt(d2),
      b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1),
      b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1),
      r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
      r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1),
      S = (r1 - r0) / ρ;

  function interpolate(t) {
    var s = t * S,
        u = w0 / (ρ2 * d1) * (cosh(r0) * tanh(ρ * s + r0) - sinh(r0));
    return [
      ux0 + u * dx,
      uy0 + u * dy,
      w0 * cosh(r0) / cosh(ρ * s + r0)
    ];
  };

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
