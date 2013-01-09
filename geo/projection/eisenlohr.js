function eisenlohr(λ, φ) {
  var f = 3 + Math.sqrt(8),
      s1 = Math.sin(λ /= 2),
      c1 = Math.cos(λ),
      k = Math.sqrt(Math.cos(φ) / 2),
      cosφ2 = Math.cos(φ /= 2),
      t = Math.sin(φ) / (cosφ2 + 2 * c1 * k),
      c = Math.sqrt(2 / (1 + t * t)),
      v = Math.sqrt((cosφ2 + (c1 + s1) * k) / (cosφ2 + (c1 - s1) * k));
  return [
    f * (c * (v - 1 / v) - 2 * Math.log(v)),
    f * (c * t * (v + 1 / v) - 2 * Math.atan(t))
  ];
}

(d3.geo.eisenlohr = function() { return projection(eisenlohr); }).raw = eisenlohr;
