function wiechel(λ, φ) {
  var cosφ = Math.cos(φ),
      sinφ = Math.cos(λ) * cosφ,
      sin1_φ = 1 - sinφ,
      cosλ = Math.cos(λ = Math.atan2(Math.sin(λ) * cosφ, -Math.sin(φ))),
      sinλ = Math.sin(λ);
  cosφ = asqrt(1 - sinφ * sinφ);
  return [
    sinλ * cosφ - cosλ * sin1_φ,
    -cosλ * cosφ - sinλ * sin1_φ
  ];
}

(d3.geo.wiechel = function() { return projection(wiechel); }).raw = wiechel;
