import "projection";

// TODO clip to ellipse
// TODO expose d3.geo.rotation?

function twoPointEquidistant(z0) {
  if (!z0) return d3.geo.azimuthalEquidistant.raw;
  var λa = -z0 / 2,
      λb = -λa,
      z02 = z0 * z0,
      tanλ0 = Math.tan(λb),
      S = .5 / Math.sin(λb);

  function forward(λ, φ) {
    var za = acos(Math.cos(φ) * Math.cos(λ - λa)),
        zb = acos(Math.cos(φ) * Math.cos(λ - λb)),
        ys = φ < 0 ? -1 : 1;
    za *= za, zb *= zb;
    return [
      (za - zb) / (2 * z0),
      ys * asqrt(4 * z02 * zb - (z02 - za + zb) * (z02 - za + zb)) / (2 * z0)
    ];
  }

  forward.invert = function(x, y) {
    var y2 = y * y,
        cosza = Math.cos(Math.sqrt(y2 + (t = x + λa) * t)),
        coszb = Math.cos(Math.sqrt(y2 + (t = x + λb) * t)),
        t,
        d;
    return [
      Math.atan2(d = cosza - coszb, t = (cosza + coszb) * tanλ0),
      (y < 0 ? -1 : 1) * acos(Math.sqrt(t * t + d * d) * S)
    ];
  };

  return forward;
}

function twoPointEquidistantProjection() {
  var points = [[0, 0], [0, 0]],
      m = projectionMutator(twoPointEquidistant),
      p = m(0),
      rotate = p.rotate;

  delete p.rotate;

  p.points = function(_) {
    if (!arguments.length) return points;
    points = _;

    // Compute the origin as the midpoint of the two reference points.
    // Rotate one of the reference points by the origin.
    // Apply the spherical law of sines to compute γ rotation.
    var interpolate = d3.geo.interpolate(_[0], _[1]),
        origin = interpolate(.5),
        p = twoPointEquidistant_rotate(-origin[0] * radians, -origin[1] * radians, _[0][0] * radians, _[0][1] * radians),
        b = interpolate.distance * .5, // |[0, 0] - p|
        c = (p[0] < 0 ? -1 : +1) * p[1], // |[p[0], 0] - p|
        γ = asin(Math.sin(c) / Math.sin(b));

    rotate.call(p, [-origin[0], -origin[1], -γ * degrees]);

    return m(b * 2);
  };

  return p;
}

function twoPointEquidistant_rotate(δλ, δφ, λ, φ) {
  var cosδφ = Math.cos(δφ),
      sinδφ = Math.sin(δφ),
      cosφ = Math.cos(φ),
      x = Math.cos(λ += δλ) * cosφ,
      y = Math.sin(λ) * cosφ,
      z = Math.sin(φ);
  return [
    Math.atan2(y, x * cosδφ - z * sinδφ),
    asin(z * cosδφ + x * sinδφ)
  ];
}

(d3.geo.twoPointEquidistant = twoPointEquidistantProjection).raw = twoPointEquidistant;
