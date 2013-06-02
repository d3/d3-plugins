import "projection";

function gilbert(λ, φ) {
  return d3.geo.orthographic.raw(λ * .5, asin(Math.tan(φ * .5)));
}

gilbert.invert = function(x, y) {
  var coordinates = d3.geo.orthographic.raw.invert(x, y);
  coordinates[0] *= 2;
  coordinates[1] = 2 * Math.atan(Math.sin(coordinates[1]));
  return coordinates;
};

function gilbertProjection() {
  var p = projection(gilbert),
      e = d3.geo.equirectangular().scale(degrees).translate([0, 0]),
      o = d3.geo.orthographic(),
      translate = p.translate,
      scale = p.scale,
      rotate = p.rotate;

  p.stream = function(stream) {
    stream = o.stream(stream);
    var s = e.stream({
      point: function(λ, φ) {
        stream.point(λ * .5, asin(Math.tan(-φ * .5 * radians)) * degrees);
      },
      lineStart: function() { stream.lineStart(); },
      lineEnd: function() { stream.lineEnd(); },
      polygonStart: function() { stream.polygonStart(); },
      polygonEnd: function() { stream.polygonEnd(); }
    });
    s.sphere = function() { stream.sphere(); };
    return s;
  };

  p.translate = function() {
    o.translate.apply(o, arguments);
    return translate.apply(this, arguments);
  };

  p.scale = function() {
    o.scale.apply(o, arguments);
    return scale.apply(this, arguments);
  };

  p.rotate = function() {
    o.rotate.apply(o, arguments);
    return rotate.apply(this, arguments);
  };

  return d3.rebind(p, o, "clipAngle", "precision");
}

(d3.geo.gilbert = gilbertProjection).raw = gilbert;
