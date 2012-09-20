(function() {
  var ε = 1e-6,
      π = Math.PI,
      sqrtπ = Math.sqrt(π);

  var robinsonConstants = [
    [1.0000, 0.0000],
    [0.9986, 0.0620],
    [0.9954, 0.1240],
    [0.9900, 0.1860],
    [0.9822, 0.2480],
    [0.9730, 0.3100],
    [0.9600, 0.3720],
    [0.9427, 0.4340],
    [0.9216, 0.4958],
    [0.8962, 0.5571],
    [0.8679, 0.6176],
    [0.8350, 0.6769],
    [0.7986, 0.7346],
    [0.7597, 0.7903],
    [0.7186, 0.8435],
    [0.6732, 0.8936],
    [0.6213, 0.9394],
    [0.5722, 0.9761],
    [0.5322, 1.0000]
  ];

  function identity(d) {
    return d;
  }

  function sinci(x) {
    return x ? x / Math.sin(x) : 1;
  }

  function sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }

  function aitoff(λ, φ) {
    var cosφ = Math.cos(φ),
        sinciα = sinci(Math.acos(cosφ * Math.cos(λ /= 2)));
    return [
      2 * cosφ * Math.sin(λ) * sinciα,
      Math.sin(φ) * sinciα
    ];
  }

  function winkel3(λ, φ) {
    var coordinates = aitoff(λ, φ);
    return [
      (coordinates[0] + λ * 2 / π) / 2,
      (coordinates[1] + φ) / 2
    ];
  }

  function kavrayskiy7(λ, φ) {
    return [
      3 * λ / (2 * π) * Math.sqrt(π * π / 3 - φ * φ),
      φ
    ];
  }

  function kavrayskiy7Inverse(x, y) {
    return [
      2 / 3 * π * x / Math.sqrt(π * π / 3 - y * y),
      y
    ];
  }

  function wagner6(λ, φ) {
    return [
      λ * Math.sqrt(1 - 3 * φ * φ / (π * π)),
      φ
    ];
  }

  function robinson(λ, φ) {
    var i = Math.min(18, Math.abs(φ) * 36 / π),
        i0 = Math.floor(i),
        di = i - i0,
        k0 = robinsonConstants[i0],
        k1 = robinsonConstants[Math.ceil(i)],
        ax = k0[0],
        ay = k0[1],
        dx = k1[0] - ax,
        dy = k1[1] - ay;
    return [
      λ * (ax + dx * di),
      (φ > 0 ? π : -π) / 2 * (ay + dy * di)
    ];
  }

  function cylindricalEqualArea(φ0) {
    var cosφ0 = Math.cos(φ0);
    return function(λ, φ) {
      return [
        λ * cosφ0,
        Math.sin(φ) / cosφ0
      ];
    };
  }

  function cylindricalEqualAreaInverse(φ0) {
    var cosφ0 = Math.cos(φ0);
    return function(x, y) {
      return [
        x / cosφ0,
        Math.asin(y * cosφ0)
      ];
    };
  }

  function sinusoidal(λ, φ) {
    return [
      λ * Math.cos(φ),
      φ
    ];
  }

  function sinusoidalInverse(x, y) {
    return [
      x / Math.cos(y),
      y
    ];
  }

  function hammer(λ, φ) {
    var coordinates = azimuthalEqualArea(λ / 2, φ);
    coordinates[0] *= 2;
    return coordinates;
  }

  function hammerInverse(x, y) {
    var coordinates = azimuthalEqualAreaInverse(x / 2, y);
    coordinates[0] *= 2;
    return coordinates;
  }

  function eckert1(λ, φ) {
    var α = Math.sqrt(8 / (3 * π));
    return [
      α * λ * (1 - Math.abs(φ) / π),
      α * φ
    ];
  }

  function eckert1Inverse(x, y) {
    var α = Math.sqrt(8 / (3 * π)),
        φ = y / α;
    return [
      x / (α * (1 - Math.abs(φ) / π)),
      φ
    ];
  }

  function eckert2(λ, φ) {
    var α = Math.sqrt(4 - 3 * Math.sin(Math.abs(φ)));
    return [
      2 / Math.sqrt(6 * π) * λ * α,
      sgn(φ) * Math.sqrt(2 * π / 3) * (2 - α)
    ];
  }

  function eckert2Inverse(x, y) {
    var α = 2 - Math.abs(y) / Math.sqrt(2 * π / 3);
    return [
      x * Math.sqrt(6 * π) / (2 * α),
      sgn(y) * Math.asin((4 - α * α) / 3)
    ];
  }

  function eckert3(λ, φ) {
    var k = Math.sqrt(π * (4 + π));
    return [
      2 / k * λ * (1 + Math.sqrt(1 - 4 * φ * φ / (π * π))),
      4 / k * φ
    ];
  }

  function eckert3Inverse(x, y) {
    var k = Math.sqrt(π * (4 + π)) / 2;
    return [
      x * k / (1 + Math.sqrt(Math.max(0, 1 - y * y * (4 + π) / (4 * π)))),
      y * k / 2
    ];
  }

  function eckert4(λ, φ) {
    var k = (2 + π / 2) * Math.sin(φ);
    φ /= 2;
    for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
      var cosφ = Math.cos(φ);
      φ -= δ = (φ + Math.sin(φ) * (cosφ + 2) - k) / (2 * cosφ * (1 + cosφ));
    }
    return [
      2 / Math.sqrt(π * (4 + π)) * λ * (1 + Math.cos(φ)),
      2 * Math.sqrt(π / (4 + π)) * Math.sin(φ)
    ];
  }

  function eckert4Inverse(x, y) {
    var j = 2 * Math.sqrt(π / (4 + π)),
        k = Math.asin(y / cy);
    return [
      x / (2 / Math.sqrt(π * (4 + π)) * (1 + (c = Math.cos(k)))),
      Math.asin((k + y / j * (c + 2)) / (2 + π / 2))
    ];
  }

  function eckert5(λ, φ) {
    return [
      λ * (1 + Math.cos(φ)) / Math.sqrt(2 + π),
      2 * φ / Math.sqrt(2 + π)
    ];
  }

  function eckert5Inverse(x, y) {
    var k = Math.sqrt(2 + π),
        φ = y * k / 2;
    return [
      k * x / (1 + Math.cos(φ)),
      φ
    ];
  }

  function eckert6(λ, φ) {
    var k = (1 + π / 2) * Math.sin(φ);
    for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
      φ -= δ = (φ + Math.sin(φ) - k) / (1 + Math.cos(φ));
    }
    k = Math.sqrt(2 + π);
    return [
      λ * (1 + Math.cos(φ)) / k,
      2 * φ / k
    ];
  }

  function eckert6Inverse(x, y) {
    var j = 1 + π / 2,
        k = Math.sqrt(j / 2);
    return [
      x * 2 * k / (1 + Math.cos(y *= k)),
      Math.asin((y + Math.sin(y)) / j)
    ];
  }

  function mollweide(λ, φ) {
    if (Math.abs(φ) !== π / 2) {
      var k = π / 2 * Math.sin(φ);
      for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
        φ -= δ = (φ + Math.sin(2 * φ) / 2 - k) / (1 + Math.cos(2 * φ));
      }
    }
    return [
      2 * Math.SQRT2 / π * λ * Math.cos(φ),
      Math.SQRT2 * Math.sin(φ)
    ];
  }

  function mollweideInverse(x, y) {
    var θ = Math.asin(y / Math.SQRT2);
    return [
      π * x / (2 * Math.SQRT2 * Math.cos(θ)),
      Math.asin((2 * θ + Math.sin(2 * θ)) / π)
    ];
  }

  function homolosine(λ, φ) {
    if (Math.abs(φ) > 40.733 * π / 180) {
      var coordinates = mollweide(λ, φ);
      coordinates[1] -= φ >= 0 ? .0528 : -.0528;
      return coordinates;
    } else return sinusoidal(λ, φ);
  }

  function homolosineInverse(x, y) {
    if (Math.abs(y) > 40.733 * π / 180) {
      coordinates = mollweideInverse(x, y);
      coordinates[1] += y >= 0 ? .0528 : -.0528;
      return coordinates;
    } else return sinusoidalInverse(x, y);
  }

  function august(λ, φ) {
    var tanφ = Math.tan(φ / 2),
        k = 1 - tanφ * tanφ,
        c = 1 + k * Math.cos(λ /= 2),
        x = Math.sin(λ) * k / c,
        y = tanφ / c,
        x2 = x * x,
        y2 = y * y;
    return [
      4 / 3 * x * (3 + x2 - 3 * y2),
      4 / 3 * y * (3 + 3 * x2 - y2)
    ];
  }

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

  function bonne(φ0) {
    var cotφ0 = 1 / Math.tan(φ0);
    return function(λ, φ) {
      var ρ = cotφ0 + φ0 - φ,
          E = λ * Math.cos(φ) / ρ;
      return [
        ρ * Math.sin(E),
        cotφ0 - ρ * Math.cos(E)
      ];
    };
  }

  function bonneInverse(φ0) {
    var cotφ0 = 1 / Math.tan(φ0);
    return function(x, y) {
      var ρ = Math.sqrt(x * x + (y = cotφ0 - y) * y),
          φ = cotφ0 + φ0 - ρ;
      return [
        ρ / Math.cos(φ) * Math.atan2(x, y),
        φ
      ];
    };
  }

  function collignon(λ, φ) {
    var α = Math.sqrt(Math.max(0, 1 - Math.sin(φ)));
    return [
      (2 / sqrtπ) * λ * α,
      sqrtπ * (1 - α)
    ];
  }

  function collignonInverse(x, y) {
    var λ = (λ = y / sqrtπ - 1) * λ;
    return [
      λ > 0 ? x * Math.sqrt(π / λ) / 2 : 0,
      Math.asin(Math.max(-1, Math.min(1, 1 - λ)))
    ];
  }

  function larrivee(λ, φ) {
    return [
      λ * (1 + Math.sqrt(Math.cos(φ))) / 2,
      φ / (Math.cos(φ / 2) * Math.cos(λ / 6))
    ];
  }

  function vanDerGrinten(λ, φ) {
    if (Math.abs(φ) < ε) return [λ, 0];
    var sinθ = Math.abs(2 * φ / π),
        θ = Math.asin(sinθ);
    if (Math.abs(λ) < ε || Math.abs(Math.abs(φ) - π / 2) < ε) return [0, sgn(φ) * π * Math.tan(θ / 2)];
    var cosθ = Math.cos(θ),
        A = Math.abs(π / λ - λ / π) / 2,
        A2 = A * A,
        G = cosθ / (sinθ + cosθ - 1),
        P = G * (2 / sinθ - 1),
        P2 = P * P,
        P2_A2 = P2 + A2,
        G_P2 = G - P2,
        Q = A2 + G;
    return [
      sgn(λ) * π * (A * G_P2 + Math.sqrt(A2 * G_P2 * G_P2 - P2_A2 * (G * G - P2))) / P2_A2,
      sgn(φ) * π * (P * Q - A * Math.sqrt((A2 + 1) * P2_A2 - Q * Q)) / P2_A2
    ];
  }

  function vanDerGrintenInverse(x, y) {
    if (Math.abs(y) < ε) return [x, 0];
    if (Math.abs(x) < ε) return [0, π / 2 * Math.sin(2 * Math.atan(y / π))];
    var x2 = (x /= π) * x,
        y2 = (y /= π) * y,
        x2_y2 = x2 + y2,
        z = x2_y2 * x2_y2,
        c1 = -Math.abs(y) * (1 + x2_y2),
        c2 = c1 - 2 * y2 + x2,
        c3 = -2 * c1 + 1 + 2 * y2 + z,
        d = y2 / c3 + (2 * c2 * c2 * c2 / (c3 * c3 * c3) - 9 * c1 * c2 / (c3 * c3)) / 27,
        a1 = (c1 - c2 * c2 / (3 * c3)) / c3,
        m1 = 2 * Math.sqrt(-a1 / 3),
        θ1 = Math.acos(3 * d / (a1 * m1)) / 3;
    return [
      π * (x2_y2 - 1 + Math.sqrt(1 + 2 * (x2 - y2) + z)) / (2 * x),
      sgn(y) * π * (-m1 * Math.cos(θ1 + π / 3) - c2 / (3 * c3))
    ];
  }

  function nellHammer(λ, φ) {
    return [
      λ * (1 + Math.cos(φ)) / 2,
      2 * (φ - Math.tan(φ / 2))
    ];
  }

  function nellHammerInverse(x, y) {
    var p = y / 2;
    for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
      var c = Math.cos(y / 2);
      y -= δ = (y - Math.tan(y / 2) - p) / (1 - .5 / (c * c));
    }
    return [
      2 * x / (1 + Math.cos(y)),
      y
    ];
  }

  function polyconic(λ, φ) {
    if (Math.abs(φ) < ε) return [λ, 0];
    var tanφ = Math.tan(φ),
        k = λ * Math.sin(φ);
    return [
      Math.sin(k) / tanφ,
      φ + (1 - Math.cos(k)) / tanφ
    ];
  }

  function polyconicInverse(x, y) {
    if (Math.abs(y) < ε) return [x, 0];
    var k = x * x + y * y,
        φ = y;
    for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
      var tanφ = Math.tan(φ);
      φ -= δ = (y * (φ * tanφ + 1) - φ - .5 * (φ * φ + k) * tanφ) / ((φ - y) / tanφ - 1);
    }
    return [
      Math.asin(x * Math.tan(φ)) / Math.sin(φ),
      φ
    ];
  }

  function miller(λ, φ) {
    return [
      λ,
      1.25 * Math.log(Math.tan(π / 4 + .4 * φ))
    ];
  }

  function millerInverse(x, y) {
    return [
      x,
      2.5 * Math.atan(Math.exp(.8 * y)) - .625 * π
    ];
  }

  function conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0),
        n = Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)),
        F = cosφ0 * Math.pow(t(φ0), n) / n;

    function t(φ) { return Math.tan(π / 4 + φ / 2); }

    return function(λ, φ) {
      var ρ = Math.abs(Math.abs(φ) - π / 2) < ε ? 0 : F / Math.pow(t(φ), n);
      return [
        ρ * Math.sin(n * λ),
        F - ρ * Math.cos(n * λ)
      ];
    };
  }

  function conicConformalInverse(φ0, φ1) {
    var cosφ0 = Math.cos(φ0),
        n = Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)),
        F = cosφ0 * Math.pow(t(φ0), n) / n;

    function t(φ) { return Math.tan(π / 4 + φ / 2); }

    return function(x, y) {
      var ρ0_y = F - y,
          ρ = sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [
        Math.atan2(x, ρ0_y) / n,
        2 * Math.atan(Math.pow(F / ρ, 1 / n)) - π / 2
      ];
    };
  }

  function albers(φ0, φ1) {
    var sinφ0 = Math.sin(φ0),
        n = (sinφ0 + Math.sin(φ1)) / 2,
        C = 1 + sinφ0 * (2 * n - sinφ0),
        ρ0 = Math.sqrt(C) / n;

    return function(λ, φ) {
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
      return [
        ρ * Math.sin(n * λ),
        ρ0 - ρ * Math.cos(n * λ)
      ];
    };
  }

  function albersInverse(φ0, φ1) {
    var sinφ0 = Math.sin(φ0),
        n = (sinφ0 + Math.sin(φ1)) / 2,
        C = 1 + sinφ0 * (2 * n - sinφ0),
        ρ0 = Math.sqrt(C) / n;

    return function(x, y) {
      var ρ0_y = ρ0 - y;
      return [
        Math.atan2(x, ρ0_y) / n,
        Math.asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n))
      ];
    };
  }

  function conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0),
        n = (cosφ0 - Math.cos(φ1)) / (φ1 - φ0),
        G = cosφ0 / n + φ0;

    return function(λ, φ) {
      var ρ = G - φ;
      return [
        ρ * Math.sin(n * λ),
        G - ρ * Math.cos(n * λ)
      ];
    };
  }

  function conicEquidistantInverse(φ0, φ1) {
    var cosφ0 = Math.cos(φ0),
        n = (cosφ0 - Math.cos(φ1)) / (φ1 - φ0),
        G = cosφ0 / n + φ0;

    return function(x, y) {
      var ρ0_y = G - y;
      return [
        Math.atan2(x, ρ0_y) / n,
        G - sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y)
      ];
    };
  }

  function guyou(λ, φ) {
    return ellipticFi(λ, sgn(φ) * Math.log(Math.tan(.5 * (Math.abs(φ) + π / 2))), .5);
  }

  // Calculate F(φ+iψ|m).
  // See Abramowitz and Stegun, 17.4.11.
  function ellipticFi(φ, ψ, m) {
    var r = Math.abs(φ),
        i = Math.abs(ψ),
        sinhψ = .5 * ((sinhψ = Math.exp(i)) - 1 / sinhψ);
    if (r) {
      var cscφ = 1 / Math.sin(r),
          cotφ2 = (cotφ2 = Math.cos(r) * cscφ) * cotφ2,
          b = -(cotφ2 + m * (sinhψ * sinhψ * cscφ * cscφ + 1) - 1),
          cotλ2 = .5 * (-b + Math.sqrt(b * b - 4 * (m - 1) * cotφ2));
      return [
        ellipticF(Math.atan(1 / Math.sqrt(cotλ2)), m) * sgn(φ),
        ellipticF(Math.atan(Math.sqrt(Math.max(0, cotλ2 / cotφ2 - 1) / m)), 1 - m) * sgn(ψ)
      ];
    } else return [0, ellipticF(Math.atan(sinhψ), 1 - m) * sgn(ψ)];
  }

  // Calculate F(φ|m) where m = k² = sin²α.
  // See Abramowitz and Stegun, 17.6.7.
  function ellipticF(φ, m) {
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

  function verticalPerspective() {
    var P = 5;

    var p = projection(function(λ, φ) {
      var cosφ = Math.cos(φ),
          k = (P - 1) / (P - (cosφ * Math.cos(λ)));
      return [
        k * cosφ * Math.sin(λ),
        k * Math.sin(φ)
      ];
    }, function(x, y) {
      var ρ2 = x * x + y * y,
          ρ = Math.sqrt(ρ2),
          sinc = (P - Math.sqrt(1 - ρ2 * (P + 1) / (P - 1))) / ((P - 1) / ρ + ρ / (P - 1));
      return [
        Math.atan2(x * sinc, ρ * Math.sqrt(1 - sinc * sinc)),
        ρ ? Math.asin(y * sinc / ρ) : 0
      ];
    });

    p.distance = function(_) {
      if (!arguments.length) return P;
      P = +_;
      return p;
    }

    return p;
  }

  function satellite() {
    var ω = 0,
        cosω = 1,
        sinω = 0,
        distance,
        verticalPerspective = d3.geo.verticalPerspective().scale(1).translate([0, 0]);

    var p = projection(function(λ, φ) {
      var coordinates = verticalPerspective([λ * 180 / π, φ * 180 / π]),
          y = -coordinates[1],
          A = y * Math.sin(ω / (distance - 1)) + cosω;
      return [
        coordinates[0] * Math.cos(ω / A),
        y / A
      ];
    }, function(x, y) {
      var k = (distance - 1) / (distance - 1 - y * sinω),
          coordinates = verticalPerspective.invert([k * x, -k * y * cosω]);
      return [
        coordinates[0] * π / 180,
        coordinates[1] * π / 180
      ];
    });

    p.distance = function(_) {
      if (!arguments.length) return distance;
      verticalPerspective.distance(distance = +_);
      return p;
    };

    p.tilt = function(_) {
      if (!arguments.length) return ω * 180 / π;
      cosω = Math.cos(ω = _ * π / 180);
      sinω = Math.sin(ω);
      return p;
    };

    return p.distance(1.4);
  }

  function lagrange() {
    var n = .5;

    var p = projection(function(λ, φ) {
      if (Math.abs(Math.abs(φ) - π / 2) < ε) return [0, φ < 0 ? -2 : 2];
      var sinφ = Math.sin(φ),
          v = Math.pow((1 + sinφ) / (1 - sinφ), n / 2),
          c = .5 * (v + 1 / v) + Math.cos(λ *= n);
      return [
        2 * Math.sin(λ) / c,
        (v - 1 / v) / c
      ];
    });

    p.spacing = function(_) {
      if (!arguments.length) return n;
      n = +_;
      return p;
    };

    return p;
  }

  function azimuthal(scale) {
    return function(λ, φ) {
      var cosλ = Math.cos(λ),
          cosφ = Math.cos(φ),
          k = scale(cosλ * cosφ);
      return [
        k * cosφ * Math.sin(λ),
        k * Math.sin(φ)
      ];
    };
  }

  // Optimized special case of azimuthal.
  function orthographic(λ, φ) {
    return [
      Math.cos(φ) * Math.sin(λ),
      Math.sin(φ)
    ];
  }

  function orthographicInverse(x, y) {
    return [
      Math.atan2(x, Math.sqrt(1 - x * x - y * y)),
      Math.asin(y)
    ];
  }

  var stereographic = azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  });

  var gnomonic = azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  });

  function gnomonicInverse(x, y) {
    return [
      Math.atan(x),
      Math.asin(y / Math.sqrt(x * x + y * y + 1))
    ];
  }

  var azimuthalEquidistant = azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  });

  function azimuthalEquidistantInverse(x, y) {
    var c = Math.sqrt(x * x + y * y),
        sinc = Math.sin(c);
    return c ? [
      Math.atan2(x * sinc, c * Math.cos(c)),
      Math.asin(y * sinc / c)
    ] : [0, 0];
  }

  var azimuthalEqualArea = azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  });

  function azimuthalEqualAreaInverse(x, y) {
    var z2 = 4 - x * x - y * y,
        z = Math.sqrt(z2);
    return [
      Math.atan2(z * x, z2 - 2),
      Math.asin(z * y / 2)
    ];
  }

  function equirectangular(λ, φ) {
    return [
      λ,
      φ
    ];
  }

  function mercator(λ, φ) {
    return [
      λ / (2 * π),
      Math.max(-.5, Math.min(+.5, Math.log(Math.tan(π / 4 + φ / 2)) / (2 * π)))
    ];
  }

  function mercatorInverse(x, y) {
    return [
      2 * π * x,
      2 * Math.atan(Math.exp(2 * π * y)) - π / 2
    ];
  }

  function projection(forward, inverse) {
    var scale = 150,
        translate = [480, 250];

    function p(coordinates) {
      coordinates = forward(coordinates[0] * π / 180, coordinates[1] * π / 180);
      return [coordinates[0] * scale + translate[0], translate[1] - coordinates[1] * scale];
    }

    if (arguments.length > 1) {
      p.invert = function(coordinates) {
        coordinates = inverse((coordinates[0] - translate[0]) / scale, (translate[1] - coordinates[1]) / scale);
        return [coordinates[0] * 180 / π, coordinates[1] * 180 / π];
      };
    }

    p.scale = function(_) {
      if (!arguments.length) return scale;
      scale = +_;
      return p;
    };

    p.translate = function(_) {
      if (!arguments.length) return translate;
      translate = [+_[0], +_[1]];
      return p;
    };

    return p;
  }

  function singleParallelProjection(forwardAt, inverseAt) {
    var φ0 = 0,
        forward = forwardAt(φ0),
        inverse = inverseAt ? inverseAt(φ0) : null,
        p = inverseAt
            ? projection(function(λ, φ) { return forward(λ, φ); }, function(x, y) { return inverse(x, y); })
            : projection(function(λ, φ) { return forward(λ, φ); });

    p.parallel = function(_) {
      if (!arguments.length) return φ0 / π * 180;
      forward = forwardAt(φ0 = _ * π / 180);
      if (inverseAt) inverse = inverseAt(φ0);
      return p;
    };

    return p;
  }

  function doubleParallelProjection(forwardAt, inverseAt) {
    var φ0 = 0,
        φ1 = π / 3,
        forward = forwardAt(φ0, φ1),
        inverse = inverseAt ? inverseAt(φ0, φ1) : null,
        p = inverseAt
            ? projection(function(λ, φ) { return forward(λ, φ); }, function(x, y) { return inverse(x, y); })
            : projection(function(λ, φ) { return forward(λ, φ); });

    p.parallels = function(_) {
      if (!arguments.length) return [φ0 / π * 180, φ1 / π * 180];
      forward = forwardAt(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
      if (inverseAt) inverse = inverseAt(φ0, φ1);
      return p;
    };

    return p;
  }

  d3.geo.graticule = function() {
    var extent = [[-180, -90], [180, 90]],
        step = [22.5, 22.5],
        precision = [2, 2];

    function graticule() {
      return {
        type: "GeometryCollection",
        geometries: graticule.lines()
      };
    }

    graticule.lines = function() {
      var xSteps = d3.range(extent[0][0], extent[1][0] + precision[0] / 2, precision[0]),
          ySteps = d3.range(extent[0][1], extent[1][1] + precision[1] / 2, precision[1]),
          xLines = d3.range(extent[0][0], extent[1][0] + step[0] / 2, step[0]).map(function(x) { return ySteps.map(function(y) { return [x, y]; }); }),
          yLines = d3.range(extent[0][1], extent[1][1] + step[1] / 2, step[1]).map(function(y) { return xSteps.map(function(x) { return [x, y]; }); });
      return xLines.concat(yLines).map(function(coordinates) {
        return {
          type: "LineString",
          coordinates: coordinates
        };
      });
    }

    graticule.outline = function() {
      var ySteps = d3.range(extent[0][1], extent[1][1] + precision[1] / 2, precision[1]),
          xSteps = d3.range(extent[0][0], extent[1][0] + precision[0] / 2, precision[0]),
          xLine0 = ySteps.map(function(y) { return [extent[0][0], y]; }),
          yLine0 = xSteps.map(function(x) { return [x, extent[1][1]]; }),
          xLine1 = ySteps.map(function(y) { return [extent[1][0], y]; }).reverse(),
          yLine1 = xSteps.map(function(x) { return [x, extent[0][1]]; }).reverse();
      yLine1.push(xLine0[0]); // closing coordinate
      return {
        type: "Polygon",
        coordinates: [xLine0.concat(yLine0, xLine1, yLine1)]
      };
    };

    graticule.extent = function(_) {
      if (!arguments.length) return extent;
      extent = _;
      return graticule;
    };

    graticule.step = function(_) {
      if (!arguments.length) return step;
      step = _;
      return graticule;
    };

    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = _;
      return graticule;
    };

    return graticule;
  };

  d3.geo.projection = projection;

  d3.geo.aitoff = function() { return projection(aitoff); };
  d3.geo.albersEqualArea = function() { return doubleParallelProjection(albers, albersInverse); }; // TODO rename albers
  d3.geo.august = function() { return projection(august); };
  d3.geo.azimuthalEqualArea = function() { return projection(azimuthalEqualArea, azimuthalEqualAreaInverse); };
  d3.geo.azimuthalEquidistant = function() { return projection(azimuthalEquidistant, azimuthalEquidistantInverse); };
  d3.geo.bonne = function() { return singleParallelProjection(bonne, bonneInverse).parallel(45); };
  d3.geo.collignon = function() { return projection(collignon, collignonInverse); };
  d3.geo.conicConformal = function() { return doubleParallelProjection(conicConformal, conicConformalInverse); };
  d3.geo.conicEquidistant = function() { return doubleParallelProjection(conicEquidistant, conicEquidistantInverse); };
  d3.geo.cylindricalEqualArea = function() { return singleParallelProjection(cylindricalEqualArea, cylindricalEqualAreaInverse); };
  d3.geo.eckert1 = function() { return projection(eckert1, eckert1Inverse); };
  d3.geo.eckert2 = function() { return projection(eckert2, eckert2Inverse); };
  d3.geo.eckert3 = function() { return projection(eckert3, eckert3Inverse); };
  d3.geo.eckert4 = function() { return projection(eckert4, eckert4Inverse); };
  d3.geo.eckert5 = function() { return projection(eckert5, eckert5Inverse); };
  d3.geo.eckert6 = function() { return projection(eckert6, eckert6Inverse); };
  d3.geo.eisenlohr = function() { return projection(eisenlohr); };
  d3.geo.equirectangular = function() { return projection(equirectangular, equirectangular); };
  d3.geo.gnomonic = function() { return projection(gnomonic, gnomonicInverse); };
  d3.geo.guyou = function() { return projection(guyou); };
  d3.geo.hammer = function() { return projection(hammer, hammerInverse); };
  d3.geo.homolosine = function() { return projection(homolosine, homolosineInverse); };
  d3.geo.kavrayskiy7 = function() { return projection(kavrayskiy7, kavrayskiy7Inverse); };
  d3.geo.lagrange = lagrange;
  d3.geo.larrivee = function() { return projection(larrivee); };
  d3.geo.mercator = function() { return projection(mercator, mercatorInverse); };
  d3.geo.miller = function() { return projection(miller, millerInverse); };
  d3.geo.mollweide = function() { return projection(mollweide, mollweideInverse); };
  d3.geo.nellHammer = function() { return projection(nellHammer, nellHammerInverse); };
  d3.geo.orthographic = function() { return projection(orthographic, orthographicInverse); };
  d3.geo.polyconic = function() { return projection(polyconic, polyconicInverse); };
  d3.geo.robinson = function() { return projection(robinson); };
  d3.geo.satellite = satellite;
  d3.geo.sinusoidal = function() { return projection(sinusoidal, sinusoidalInverse); };
  d3.geo.stereographic = function() { return projection(stereographic); };
  d3.geo.vanDerGrinten = function() { return projection(vanDerGrinten, vanDerGrintenInverse); };
  d3.geo.verticalPerspective = verticalPerspective;
  d3.geo.wagner6 = function() { return projection(wagner6); };
  d3.geo.winkel3 = function() { return projection(winkel3); };
})();
