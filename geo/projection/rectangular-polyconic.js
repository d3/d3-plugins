// @import parallel1

function rectangularPolyconic(φ0) {
  var sinφ0 = Math.sin(φ0);

  function forward(λ, φ) {
    var A = sinφ0 ? Math.tan(λ * sinφ0 / 2) / sinφ0 : λ / 2;
    if (!φ) return [2 * A, -φ0];
    var E = 2 * Math.atan(A * Math.sin(φ)),
        cotφ = 1 / Math.tan(φ);
    return [
      cotφ * Math.sin(E),
      φ - φ0 + cotφ * (1 - Math.cos(E))
    ];
  }

  return forward;
}

(d3.geo.rectangularPolyconic = function() { return parallel1Projection(rectangularPolyconic); }).raw = rectangularPolyconic;
