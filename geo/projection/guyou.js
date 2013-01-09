function guyou(λ, φ) {
  return guyouEllipticFi(λ, sgn(φ) * Math.log(Math.tan(.5 * (Math.abs(φ) + π / 2))), .5);
}

// Calculate F(φ+iψ|m).
// See Abramowitz and Stegun, 17.4.11.
function guyouEllipticFi(φ, ψ, m) {
  var r = Math.abs(φ),
      i = Math.abs(ψ),
      sinhψ = .5 * ((sinhψ = Math.exp(i)) - 1 / sinhψ);
  if (r) {
    var cscφ = 1 / Math.sin(r),
        cotφ2 = (cotφ2 = Math.cos(r) * cscφ) * cotφ2,
        b = -(cotφ2 + m * (sinhψ * sinhψ * cscφ * cscφ + 1) - 1),
        cotλ2 = .5 * (-b + Math.sqrt(b * b - 4 * (m - 1) * cotφ2));
    return [
      guyouEllipticF(Math.atan(1 / Math.sqrt(cotλ2)), m) * sgn(φ),
      guyouEllipticF(Math.atan(Math.sqrt(cotλ2 / cotφ2 - 1) / m), 1 - m) * sgn(ψ)
    ];
  }
  return [
    0,
    guyouEllipticF(Math.atan(sinhψ), 1 - m) * sgn(ψ)
  ];
}

// Calculate F(φ|m) where m = k² = sin²α.
// See Abramowitz and Stegun, 17.6.7.
function guyouEllipticF(φ, m) {
  var a = 1,
      b = Math.sqrt(1 - m),
      c = Math.sqrt(m);
  for (var i = 0; Math.abs(c) > ε; i++) {
    if (φ % π) {
      var dφ = Math.atan(b * Math.tan(φ) / a);
      if (dφ < 0) dφ += π;
      φ += dφ + ~~(φ / π) * π;
    } else φ += φ;
    c = (a + b) / 2;
    b = Math.sqrt(a * b);
    c = ((a = c) - b) / 2;
  }
  return φ / (Math.pow(2, i) * a);
}

(d3.geo.guyou = function() { return projection(guyou); }).raw = guyou;
