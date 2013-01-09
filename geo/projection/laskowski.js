function laskowski(λ, φ) {
  var λ2 = λ * λ, φ2 = φ * φ;
  return [
    λ * (.975534 + φ2 * (-.119161 + λ2 * -.0143059 + φ2 * -.0547009)),
    φ * (1.00384 + λ2 * (.0802894 + φ2 * -.02855 + λ2 * .000199025) + φ2 * (.0998909 + φ2 * -.0491032))
  ];
}

(d3.geo.laskowski = function() { return projection(laskowski); }).raw = laskowski;
