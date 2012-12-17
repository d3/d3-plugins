(function() {
  var ε = 1e-6,
      π = Math.PI,
      sqrtπ = Math.sqrt(π),
      sinumollφ = 0.7109889596207567;

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

  function sinci(x) {
    return x ? x / Math.sin(x) : 1;
  }

  function sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }

  function asqrt(x) {
    return x > 0 ? Math.sqrt(x) : 0;
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
    }
    return [
      0,
      ellipticF(Math.atan(sinhψ), 1 - m) * sgn(ψ)
    ];
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

  kavrayskiy7.invert = function(x, y) {
    return [
      2 / 3 * π * x / Math.sqrt(π * π / 3 - y * y),
      y
    ];
  };

  function wagner6(λ, φ) {
    return [
      λ * Math.sqrt(1 - 3 * φ * φ / (π * π)),
      φ
    ];
  }

  wagner6.invert = function(x, y) {
    return [
      x / Math.sqrt(1 - 3 * y * y / (π * π)),
      y
    ];
  };

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

    function forward(λ, φ) {
      return [
        λ * cosφ0,
        Math.sin(φ) / cosφ0
      ];
    }

    forward.invert = function(x, y) {
      return [
        x / cosφ0,
        Math.asin(y * cosφ0)
      ];
    };

    return forward;
  }

  function sinusoidal(λ, φ) {
    return [
      λ * Math.cos(φ),
      φ
    ];
  }

  sinusoidal.invert = function(x, y) {
    return [
      x / Math.cos(y),
      y
    ];
  };

  var azimuthalEqualArea = d3.geo.azimuthalEqualArea.raw;

  function hammer(λ, φ) {
    var coordinates = azimuthalEqualArea(λ / 2, φ);
    coordinates[0] *= 2;
    return coordinates;
  }

  hammer.invert = function(x, y) {
    var coordinates = azimuthalEqualArea.invert(x / 2, y);
    coordinates[0] *= 2;
    return coordinates;
  };

  function eckert1(λ, φ) {
    var α = Math.sqrt(8 / (3 * π));
    return [
      α * λ * (1 - Math.abs(φ) / π),
      α * φ
    ];
  }

  eckert1.invert = function(x, y) {
    var α = Math.sqrt(8 / (3 * π)),
        φ = y / α;
    return [
      x / (α * (1 - Math.abs(φ) / π)),
      φ
    ];
  };

  function eckert2(λ, φ) {
    var α = Math.sqrt(4 - 3 * Math.sin(Math.abs(φ)));
    return [
      2 / Math.sqrt(6 * π) * λ * α,
      sgn(φ) * Math.sqrt(2 * π / 3) * (2 - α)
    ];
  }

  eckert2.invert = function(x, y) {
    var α = 2 - Math.abs(y) / Math.sqrt(2 * π / 3);
    return [
      x * Math.sqrt(6 * π) / (2 * α),
      sgn(y) * Math.asin((4 - α * α) / 3)
    ];
  };

  function eckert3(λ, φ) {
    var k = Math.sqrt(π * (4 + π));
    return [
      2 / k * λ * (1 + Math.sqrt(1 - 4 * φ * φ / (π * π))),
      4 / k * φ
    ];
  }

  eckert3.invert = function(x, y) {
    var k = Math.sqrt(π * (4 + π)) / 2;
    return [
      x * k / (1 + Math.sqrt(Math.max(0, 1 - y * y * (4 + π) / (4 * π)))),
      y * k / 2
    ];
  };

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

  eckert4.invert = function(x, y) {
    var j = 2 * Math.sqrt(π / (4 + π)),
        k = Math.asin(y / cy),
        c = Math.cos(k);
    return [
      x / (2 / Math.sqrt(π * (4 + π)) * (1 + c)),
      Math.asin((k + y / j * (c + 2)) / (2 + π / 2))
    ];
  };

  function eckert5(λ, φ) {
    return [
      λ * (1 + Math.cos(φ)) / Math.sqrt(2 + π),
      2 * φ / Math.sqrt(2 + π)
    ];
  }

  eckert5.invert = function(x, y) {
    var k = Math.sqrt(2 + π),
        φ = y * k / 2;
    return [
      k * x / (1 + Math.cos(φ)),
      φ
    ];
  };

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

  eckert6.invert = function(x, y) {
    var j = 1 + π / 2,
        k = Math.sqrt(j / 2);
    return [
      x * 2 * k / (1 + Math.cos(y *= k)),
      Math.asin((y + Math.sin(y)) / j)
    ];
  };

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

  mollweide.invert = function(x, y) {
    var θ = Math.asin(y / Math.SQRT2);
    return [
      π * x / (2 * Math.SQRT2 * Math.cos(θ)),
      Math.asin((2 * θ + Math.sin(2 * θ)) / π)
    ];
  };

  function homolosine(λ, φ) {
    if (Math.abs(φ) > sinumollφ) {
      var coordinates = mollweide(λ, φ);
      coordinates[1] -= φ >= 0 ? .0528 : -.0528;
      return coordinates;
    }
    return sinusoidal(λ, φ);
  }

  function sinuMollweide(λ, φ) {
    if (φ > -sinumollφ) {
      var coordinates = mollweide(λ, φ);
      coordinates[1] += .0528;
      return coordinates;
    }
    return sinusoidal(λ, φ);
  }

  function hatano(λ, φ) {
    var c = Math.sin(φ) * (φ < 0 ? 2.43763 : 2.67595);
    for (var i = 0, δ; i < 20; i++) {
      φ -= δ = (φ + Math.sin(φ) - c) / (1 + Math.cos(φ));
      if (Math.abs(δ) < ε) break;
    }
    return [
      .85 * λ * Math.cos(φ *= .5),
      Math.sin(φ) * (φ < 0 ? 1.93052 : 1.75859)
    ];
  }

  hatano.invert = function(x, y) {
    var θ = Math.abs(θ = y * (y < 0 ? .51799515156538134803 : .56863737426006061674)) > 1 - ε
        ? θ > 0 ? π / 2 : -π / 2
        : Math.asin(θ);
    return [
      1.17647058823529411764 * x / Math.cos(θ),
      Math.abs(θ = ((θ += θ) + Math.sin(θ)) * (y < 0 ? .41023453108141924738 : .37369906014686373063)) > 1 - ε
        ? θ > 0 ? π / 2 : -π / 2
        : Math.asin(θ)
    ];
  };

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
    if (!φ0) return sinusoidal;
    var cotφ0 = 1 / Math.tan(φ0);

    function forward(λ, φ) {
      var ρ = cotφ0 + φ0 - φ,
          E = λ * Math.cos(φ) / ρ;
      return [
        ρ * Math.sin(E),
        cotφ0 - ρ * Math.cos(E)
      ];
    }

    forward.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + (y = cotφ0 - y) * y),
          φ = cotφ0 + φ0 - ρ;
      return [
        ρ / Math.cos(φ) * Math.atan2(x, y),
        φ
      ];
    };

    return forward;
  }

  function collignon(λ, φ) {
    var α = Math.sqrt(Math.max(0, 1 - Math.sin(φ)));
    return [
      (2 / sqrtπ) * λ * α,
      sqrtπ * (1 - α)
    ];
  }

  collignon.invert = function(x, y) {
    var λ = (λ = y / sqrtπ - 1) * λ;
    return [
      λ > 0 ? x * Math.sqrt(π / λ) / 2 : 0,
      Math.asin(Math.max(-1, Math.min(1, 1 - λ)))
    ];
  };

  function larrivee(λ, φ) {
    return [
      λ * (1 + Math.sqrt(Math.cos(φ))) / 2,
      φ / (Math.cos(φ / 2) * Math.cos(λ / 6))
    ];
  }

  larrivee.invert = function(x, y) {
    var x0 = Math.abs(x),
        y0 = Math.abs(y),
        π_sqrt2 = π / Math.SQRT2,
        λ = ε,
        φ = π / 2;
    if (y0 < π_sqrt2) φ *= y0 / π_sqrt2;
    else λ += 6 * Math.acos(π_sqrt2 / y0);
    for (var i = 0; i < 25; i++) {
      var sinφ = Math.sin(φ),
          sqrtcosφ = asqrt(Math.cos(φ)),
          sinφ_2 = Math.sin(φ / 2),
          cosφ_2 = Math.cos(φ / 2),
          sinλ_6 = Math.sin(λ / 6),
          cosλ_6 = Math.cos(λ / 6),
          f0 = .5 * λ * (1 + sqrtcosφ) - x0,
          f1 = φ / (cosφ_2 * cosλ_6) - y0,
          df0dφ = sqrtcosφ ? -.25 * λ * sinφ / sqrtcosφ : 0,
          df0dλ = .5 * (1 + sqrtcosφ),
          df1dφ = (1 + .5 * φ * sinφ_2 / cosφ_2) / (cosφ_2 * cosλ_6),
          df1dλ = (φ / cosφ_2) * (sinλ_6 / 6) / (cosλ_6 * cosλ_6),
          denom = df0dφ * df1dλ - df1dφ * df0dλ,
          dφ = (f0 * df1dλ - f1 * df0dλ) / denom,
          dλ = (f1 * df0dφ - f0 * df1dφ) / denom;
      φ -= dφ;
      λ -= dλ;
      if (Math.abs(dφ) < ε && Math.abs(dλ) < ε) break;
    }
    return [x < 0 ? -λ : λ, y < 0 ? -φ : φ];
  };

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

  vanDerGrinten.invert = function(x, y) {
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
  };

  function loximuthal(φ0) {
    var cosφ0 = Math.cos(φ0),
        tanφ0 = Math.tan(π / 4 + φ0 / 2);

    function forward(λ, φ) {
      var y = φ - φ0,
          x = Math.abs(y) < ε ? λ * cosφ0
          : Math.abs(x = π / 4 + φ / 2) < ε || Math.abs(Math.abs(x) - π / 2) < ε
          ? 0 : λ * y / Math.log(Math.tan(x) / tanφ0);
      return [x, y];
    }

    forward.invert = function(x, y) {
      var λ,
          φ = y + φ0;
      return [
        Math.abs(y) < ε ? x / cosφ0
          : (Math.abs(λ = π / 4 + φ / 2) < ε || Math.abs(Math.abs(λ) - π / 2) < ε) ? 0
          : x * Math.log(Math.tan(λ) / tanφ0) / y,
        φ
      ];
    };

    return forward;
  }

  function nellHammer(λ, φ) {
    return [
      λ * (1 + Math.cos(φ)) / 2,
      2 * (φ - Math.tan(φ / 2))
    ];
  }

  nellHammer.invert = function(x, y) {
    var p = y / 2;
    for (var i = 0, δ = Infinity; i < 10 && Math.abs(δ) > ε; i++) {
      var c = Math.cos(y / 2);
      y -= δ = (y - Math.tan(y / 2) - p) / (1 - .5 / (c * c));
    }
    return [
      2 * x / (1 + Math.cos(y)),
      y
    ];
  };

  function polyconic(λ, φ) {
    if (Math.abs(φ) < ε) return [λ, 0];
    var tanφ = Math.tan(φ),
        k = λ * Math.sin(φ);
    return [
      Math.sin(k) / tanφ,
      φ + (1 - Math.cos(k)) / tanφ
    ];
  }

  polyconic.invert = function(x, y) {
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
  };

  function miller(λ, φ) {
    return [
      λ,
      1.25 * Math.log(Math.tan(π / 4 + .4 * φ))
    ];
  }

  miller.invert = function(x, y) {
    return [
      x,
      2.5 * Math.atan(Math.exp(.8 * y)) - .625 * π
    ];
  };

  function conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0),
        t = function(φ) { return Math.tan(π / 4 + φ / 2); },
        n = Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)),
        F = cosφ0 * Math.pow(t(φ0), n) / n;

    function forward(λ, φ) {
      var ρ = Math.abs(Math.abs(φ) - π / 2) < ε ? 0 : F / Math.pow(t(φ), n);
      return [
        ρ * Math.sin(n * λ),
        F - ρ * Math.cos(n * λ)
      ];
    }

    forward.invert = function(x, y) {
      var ρ0_y = F - y,
          ρ = sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [
        Math.atan2(x, ρ0_y) / n,
        2 * Math.atan(Math.pow(F / ρ, 1 / n)) - π / 2
      ];
    };

    return forward;
  }

  function conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0),
        n = (cosφ0 - Math.cos(φ1)) / (φ1 - φ0),
        G = cosφ0 / n + φ0;

    function forward(λ, φ) {
      var ρ = G - φ;
      return [
        ρ * Math.sin(n * λ),
        G - ρ * Math.cos(n * λ)
      ];
    }

    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [
        Math.atan2(x, ρ0_y) / n,
        G - sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y)
      ];
    };

    return forward;
  }

  function guyou(λ, φ) {
    return ellipticFi(λ, sgn(φ) * Math.log(Math.tan(.5 * (Math.abs(φ) + π / 2))), .5);
  }

  function peirceQuincuncial(λ, φ) {
    var t = Math.abs(λ) < π / 2,
        p = guyou(t ? λ : -sgn(λ) * (π - Math.abs(λ)), φ),
        x = p[0] / Math.SQRT2 - p[1] / Math.SQRT2,
        y = p[1] / Math.SQRT2 + p[0] / Math.SQRT2;
    if (t) return [x, y];
    var d = 2 * 1.311028777082283, // TODO unobfuscate
        s = (x > 0) ^ (y > 0) ? -1 : 1;
    return [s * x - sgn(y) * d, s * y - sgn(x) * d];
  }

  function verticalPerspective(P) {
    function forward(λ, φ) {
      var cosφ = Math.cos(φ),
          k = (P - 1) / (P - cosφ * Math.cos(λ));
      return [
        k * cosφ * Math.sin(λ),
        k * Math.sin(φ)
      ];
    }

    forward.invert = function(x, y) {
      var ρ2 = x * x + y * y,
          ρ = Math.sqrt(ρ2),
          sinc = (P - Math.sqrt(1 - ρ2 * (P + 1) / (P - 1))) / ((P - 1) / ρ + ρ / (P - 1));
      return [
        Math.atan2(x * sinc, ρ * Math.sqrt(1 - sinc * sinc)),
        ρ ? Math.asin(y * sinc / ρ) : 0
      ];
    };

    return forward;
  }

  function satellite(P, ω) {
    var vertical = verticalPerspective(P);
    if (!ω) return vertical;
    var cosω = Math.cos(ω),
        sinω = Math.sin(ω);

    function forward(λ, φ) {
      var coordinates = vertical(λ, φ),
          y = coordinates[1],
          A = y * sinω / (P - 1) + cosω;
      return [
        coordinates[0] * cosω / A,
        y / A
      ];
    }

    forward.invert = function(x, y) {
      var k = (P - 1) / (P - 1 - y * sinω);
      return vertical.invert(k * x, k * y * cosω);
    };

    return forward;
  }

  function lagrange(n) {
    return function(λ, φ) {
      if (Math.abs(Math.abs(φ) - π / 2) < ε) return [0, φ < 0 ? -2 : 2];
      var sinφ = Math.sin(φ),
          v = Math.pow((1 + sinφ) / (1 - sinφ), n / 2),
          c = .5 * (v + 1 / v) + Math.cos(λ *= n);
      return [
        2 * Math.sin(λ) / c,
        (v - 1 / v) / c
      ];
    };
  }

  function singleParallelProjection(projectAt) {
    var φ0 = 0,
        m = projectionMutator(projectAt),
        p = m(φ0);

    p.parallel = function(_) {
      if (!arguments.length) return φ0 / π * 180;
      return m(φ0 = _ * π / 180);
    };

    return p;
  }

  function doubleParallelProjection(projectAt) {
    var φ0 = 0,
        φ1 = π / 3,
        m = projectionMutator(projectAt),
        p = m(φ0, φ1);

    p.parallels = function(_) {
      if (!arguments.length) return [φ0 / π * 180, φ1 / π * 180];
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };

    return p;
  }

  function lagrangeProjection() {
    var n = .5,
        m = projectionMutator(lagrange),
        p = m(n);

    p.spacing = function(_) {
      if (!arguments.length) return n;
      return m(n = +_);
    };

    return p;
  }

  function satelliteProjection() {
    var P = 1.4,
        ω = 0,
        m = projectionMutator(satellite),
        p = m(P, ω);

    // As a multiple of radius.
    p.distance = function(_) {
      if (!arguments.length) return P;
      return m(P = +_, ω);
    };

    p.tilt = function(_) {
      if (!arguments.length) return ω * 180 / π;
      return m(P, ω = _ * π / 180);
    };

    return p;
  }

  function gringortenProjection() {
    var quincuncial = false,
        m = projectionMutator(gringorten),
        p = m(quincuncial);

    p.quincuncial = function(_) {
      if (!arguments.length) return quincuncial;
      return m(quincuncial = !!_);
    };

    return p;
  }

  function gringorten(quincuncial) {
    return function(λ, φ) {
      var cosφ = Math.cos(φ),
          x = Math.cos(λ) * cosφ,
          y = Math.sin(λ) * cosφ,
          z = Math.sin(φ);
      if (quincuncial) {
        λ = Math.atan2(y, -z) - π / 4;
        φ = Math.asin(Math.max(-1, Math.min(1, x)));
      } else {
        λ = Math.atan2(z, x) + π / 2;
        φ = Math.asin(Math.max(-1, Math.min(1, -y)));
      }
      while (λ < 0) λ += 2 * π;
      var nφ = φ < 0,
          df = ~~(λ / (π / 4));
      λ %= π / 2;
      var point = gringortenHexadecant(df & 1 ? π / 2 - λ : λ, Math.abs(φ)),
          x = point[0],
          y = point[1],
          t;
      if (quincuncial && nφ) y = -2 - y;
      if (df > 3) x = -x, y = -y;
      switch (df % 4) {
        case 1: x = -x; // fall through
        case 2: t = x; x = -y; y = t; break;
        case 3: y = -y; break;
      }
      if (!quincuncial && nφ) x = 2 - x;
      return quincuncial ? [(x - y) / Math.SQRT2, (x + y) / Math.SQRT2] : [x, y];
    };
  }

  function gringortenHexadecant(λ, φ) {
    if (φ === π / 2) return [0, 0];

    var sinφ = Math.sin(φ),
        r = sinφ * sinφ,
        r2 = r * r,
        j = 1 + r2,
        k = 1 + 3 * r2,
        q = 1 - r2,
        z = Math.asin(1 / Math.sqrt(j)),
        v = q + r * j * z,
        p2 = (1 - sinφ) / v,
        p = Math.sqrt(p2),
        a2 = p2 * j,
        a = Math.sqrt(a2),
        h = p * q;
    if (λ === 0) return [0, -(h + r * a)];

    var cosφ = Math.cos(φ),
        secφ = 1 / cosφ,
        drdφ = 2 * sinφ * cosφ,
        dvdφ = (-3 * r + z * k) * drdφ,
        dp2dφ = (-v * cosφ - (1 - sinφ) * dvdφ) / (v * v),
        dpdφ = (.5 * dp2dφ) / p,
        dhdφ = q * dpdφ - 2 * r * p * drdφ,
        dra2dφ = r * j * dp2dφ + p2 * k * drdφ,
        μ = -secφ * drdφ,
        ν = -secφ * dra2dφ,
        ζ = -2 * secφ * dhdφ,
        Λ = 4 * λ / π;

    if (λ > .222 * π || φ < π / 4 && λ > .175 * π) {
      // Slower but accurate bisection method.
      var x = (h + r * asqrt(a2 * (1 + r2) - h * h)) / (1 + r2);
      if (λ > π / 4) return [x, x];

      var x1 = x,
          x0 = .5 * x,
          i = -1;
      x = .5 * (x0 + x1);
      do {
        var g = Math.sqrt(a2 - x * x),
            f = (x * (ζ + μ * g) + ν * Math.asin(x / a)) - Λ;
        if (!f) break;
        if (f < 0) x0 = x;
        else x1 = x;
        x = .5 * (x0 + x1);
      } while (++i < 50 && Math.abs(x1 - x0) > ε);
    } else {
      // Newton-Raphson.
      for (var x = ε, i = 0; i < 25; i++) {
        var x2 = x * x,
            g = asqrt(a2 - x2),
            ζμg = ζ + μ * g,
            f = x * ζμg + ν * Math.asin(x / a) - Λ,
            df = ζμg + (ν - μ * x2) / g,
            dx = g ? -f / df : 0;
        x += dx;
        if (Math.abs(dx) < ε) break;
      }
    }
    return [x, -h - r * asqrt(a2 - x * x)];
  }

  var projection = d3.geo.projection,
      projectionMutator = d3.geo.projectionMutator;

  (d3.geo.aitoff = function() { return projection(aitoff); }).raw = aitoff;
  (d3.geo.august = function() { return projection(august); }).raw = august;
  (d3.geo.bonne = function() { return singleParallelProjection(bonne).parallel(45); }).raw = bonne;
  (d3.geo.collignon = function() { return projection(collignon); }).raw = collignon;
  (d3.geo.conicConformal = function() { return doubleParallelProjection(conicConformal); }).raw = conicConformal;
  (d3.geo.conicEquidistant = function() { return doubleParallelProjection(conicEquidistant); }).raw = conicEquidistant;
  (d3.geo.cylindricalEqualArea = function() { return singleParallelProjection(cylindricalEqualArea); }).raw = cylindricalEqualArea;
  (d3.geo.eckert1 = function() { return projection(eckert1); }).raw = eckert1;
  (d3.geo.eckert2 = function() { return projection(eckert2); }).raw = eckert2;
  (d3.geo.eckert3 = function() { return projection(eckert3); }).raw = eckert3;
  (d3.geo.eckert4 = function() { return projection(eckert4); }).raw = eckert4;
  (d3.geo.eckert5 = function() { return projection(eckert5); }).raw = eckert5;
  (d3.geo.eckert6 = function() { return projection(eckert6); }).raw = eckert6;
  (d3.geo.eisenlohr = function() { return projection(eisenlohr); }).raw = eisenlohr;
  (d3.geo.gringorten = gringortenProjection).raw = gringorten;
  (d3.geo.guyou = function() { return projection(guyou); }).raw = guyou;
  (d3.geo.hammer = function() { return projection(hammer); }).raw = hammer;
  (d3.geo.homolosine = function() { return projection(homolosine); }).raw = homolosine;
  (d3.geo.hatano = function() { return projection(hatano); }).raw = hatano;
  (d3.geo.kavrayskiy7 = function() { return projection(kavrayskiy7); }).raw = kavrayskiy7;
  (d3.geo.lagrange = lagrangeProjection).raw = lagrange;
  (d3.geo.larrivee = function() { return projection(larrivee); }).raw = larrivee;
  (d3.geo.loximuthal = function() { return singleParallelProjection(loximuthal).parallel(40); }).raw = loximuthal;
  (d3.geo.miller = function() { return projection(miller); }).raw = miller;
  (d3.geo.mollweide = function() { return projection(mollweide); }).raw = mollweide;
  (d3.geo.nellHammer = function() { return projection(nellHammer); }).raw = nellHammer;
  (d3.geo.peirceQuincuncial = function() { return projection(peirceQuincuncial).rotate([-90, -90, 45]).clipAngle(180 - 1e-6); }).raw = peirceQuincuncial;
  (d3.geo.polyconic = function() { return projection(polyconic); }).raw = polyconic;
  (d3.geo.robinson = function() { return projection(robinson); }).raw = robinson;
  (d3.geo.satellite = satelliteProjection).raw = satellite;
  (d3.geo.sinusoidal = function() { return projection(sinusoidal); }).raw = sinusoidal;
  (d3.geo.sinuMollweide = function() { return projection(sinuMollweide).rotate([-20, -55]); }).raw = sinuMollweide;
  (d3.geo.vanDerGrinten = function() { return projection(vanDerGrinten); }).raw = vanDerGrinten;
  (d3.geo.wagner6 = function() { return projection(wagner6); }).raw = wagner6;
  (d3.geo.winkel3 = function() { return projection(winkel3); }).raw = winkel3;
})();
