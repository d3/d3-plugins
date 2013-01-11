function hammerRetroazimuthal(φ0) {
  var sinφ0 = Math.sin(φ0),
      cosφ0 = Math.cos(φ0);

  function forward(λ, φ) {
    var cosφ = Math.cos(φ),
        // Cartesian coordinates.
        x = Math.cos(λ) * cosφ,
        y = Math.sin(λ) * cosφ,
        z = Math.sin(φ),
        // Latitudinal rotation of φ by φ0.
        sinφ = z * cosφ0 + x * sinφ0,
        // Latitudinal rotation of λ by φ0 (inline).
        cosλ = Math.cos(λ = Math.atan2(y, x * cosφ0 - z * sinφ0)),
        cosφ = Math.cos(φ = asin(sinφ)),
        z = acos(sinφ0 * sinφ + cosφ0 * cosφ * cosλ),
        sinz = Math.sin(z),
        K = Math.abs(sinz) > ε ? z / sinz : 1;
    return [
      K * cosφ0 * Math.sin(λ),
      (Math.abs(λ) > π / 2 ? K : -K) // rotate for back hemisphere
        * (sinφ0 * cosφ - cosφ0 * sinφ * cosλ)
    ];
  }

  return forward;
}

function hammerRetroazimuthalProjection() {
  var φ0 = 0,
      m = projectionMutator(hammerRetroazimuthal),
      p = m(φ0),
      rotate_ = p.rotate,
      stream_ = p.stream,
      circle = d3.geo.circle();

  p.parallel = function(_) {
    if (!arguments.length) return φ0 / π * 180;
    var r = p.rotate();
    return m(φ0 = _ * π / 180).rotate(r);
  };

  p.rotate = function(_) {
    if (!arguments.length) return (_ = rotate_.call(p), _[1] += φ0 / π * 180, _);
    rotate_.call(p, [_[0], _[1] - φ0 / π * 180]);
    circle.origin([-_[0], -_[1]]);
    return p;
  };

  p.stream = function(stream) {
    stream = stream_(stream);
    stream.sphere = function() {
      stream.polygonStart();
      var ε = 1e-2,
          ring = circle.angle(90 - ε)().coordinates[0],
          n = ring.length - 1,
          i = -1,
          p;
      stream.lineStart();
      while (++i < n) stream.point((p = ring[i])[0], p[1]);
      stream.lineEnd();
      ring = circle.angle(90 + ε)().coordinates[0];
      n = ring.length - 1;
      stream.lineStart();
      while (--i >= 0) stream.point((p = ring[i])[0], p[1]);
      stream.lineEnd();
      stream.polygonEnd();
    };
    return stream;
  };

  return p;
}

(d3.geo.hammerRetroazimuthal = hammerRetroazimuthalProjection).raw = hammerRetroazimuthal;
