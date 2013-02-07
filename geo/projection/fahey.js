function fahey(λ, φ) {
  var t = Math.tan(φ / 2);
  return [
    λ * fahey_k * asqrt(1 - t * t),
    (1 + fahey_k) * t
  ];
}

fahey.invert = function(x, y) {
  var t = y / (1 + fahey_k);
  return [
    x ? x / (fahey_k * asqrt(1 - t * t)) : 0,
    2 * Math.atan(t)
  ];
};

var fahey_k = Math.cos(35 * radians);

(d3.geo.fahey = function() { return projection(fahey); }).raw = fahey;
