function armadillo(φ0) {
  var sinφ0 = Math.sin(φ0),
      cosφ0 = Math.cos(φ0),
      tanφ0 = Math.tan(φ0),
      k = (1 + sinφ0 - cosφ0) / 2

  function forward(λ, φ) {
    var cosφ = Math.cos(φ),
        cosλ = Math.cos(λ /= 2),
        φ1 = -Math.atan2(cosλ, tanφ0);
    return [
      (1 + cosφ) * Math.sin(λ),
      (φ > φ1 - 1e-3 ? 0 : -1) + // TODO hack
        k + Math.sin(φ) * cosφ0 - (1 + cosφ) * sinφ0 * cosλ
    ];
  }

  return forward;
}

function armadilloProjection() {
  var φ0 = π / 9, // 20°
      tanφ0 = Math.tan(φ0),
      m = projectionMutator(armadillo),
      p = m(φ0),
      stream_ = p.stream;

  p.parallel = function(_) {
    if (!arguments.length) return φ0 / π * 180;
    return m(φ0 = _ * π / 180);
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      for (var λ = -180; λ < 180; λ += 90) sphereStream.point(λ, 90);
      while (--λ >= -180) { // TODO precision?
        sphereStream.point(λ, -Math.atan2(Math.cos(λ * radians / 2), tanφ0) * degrees);
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p;
}

(d3.geo.armadillo = armadilloProjection).raw = armadillo;
