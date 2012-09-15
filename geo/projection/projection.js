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
    var cosφ = Math.cos(φ),
        k = Math.sqrt(2 / (1 + cosφ * Math.cos(λ /= 2)));
    return [
      Math.sin(λ) * cosφ * k * 2,
      Math.sin(φ) * k
    ];
  }

  function hammerInverse(x, y) {
    var z = Math.sqrt(1 - x * x / 16 - y * y / 4);
    return [
      2 * Math.atan2(z * x, 4 * z * z - 2),
      Math.asin(z * y)
    ];
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

  function eckert3(λ, φ) {
    var k = Math.sqrt(π * (4 + π));
    return [
      2 / k * λ * (1 + Math.sqrt(1 - 4 * φ * φ / (π * π))),
      4 / k * φ
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

  function eckert5(λ, φ) {
    return [
      λ * (1 + Math.cos(φ)) / Math.sqrt(2 + π),
      2 * φ / Math.sqrt(2 + π)
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
    return (Math.abs(φ) > 41.737 * π / 180 ? mollweide : sinusoidal)(λ, φ);
  }

  function homolosineInverse(x, y) {
    return (Math.abs(y) > 41.737 * π / 180 ? mollweideInverse : sinusoidalInverse)(x, y);
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
      var φ = cotφ0 + φ0 - ρ;
      return [
        ρ / Math.cos(φ) * Math.atan(x / (cotφ0 - y)),
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
        A = .5 * Math.abs(π / λ - λ / π),
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

  function nellHammer(λ, φ) {
    return [
      λ * (1 + Math.cos(φ)) / 2,
      2 * (φ - Math.tan(φ / 2))
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

  function projection(forward, inverse) {
    var scale = 150,
        translate = [480, 250];

    function p(coordinates) {
      coordinates = forward(coordinates[0] * π / 180, coordinates[1] * π / 180);
      return [coordinates[0] * scale + translate[0], translate[1] - coordinates[1] * scale];
    }

    if (arguments.length > 1) {
      p.invert = function(coordinates) {
        coordinates = inverse((coordinates[0] - translate[0]) / scale, (coordinates[1] - translate[1]) / scale);
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
  d3.geo.albersEqualArea = function() { return doubleParallelProjection(albers, albersInverse); };
  d3.geo.bonne = function() { return singleParallelProjection(bonne, bonneInverse).parallel(45); };
  d3.geo.collignon = function() { return projection(collignon) };
  d3.geo.conicConformal = function() { return doubleParallelProjection(conicConformal); };
  d3.geo.conicEquidistant = function() { return doubleParallelProjection(conicEquidistant, conicEquidistantInverse); };
  d3.geo.cylindricalEqualArea = function() { return singleParallelProjection(cylindricalEqualArea, cylindricalEqualAreaInverse); };
  d3.geo.eckert1 = function() { return projection(eckert1, eckert1Inverse); };
  d3.geo.eckert2 = function() { return projection(eckert2); };
  d3.geo.eckert3 = function() { return projection(eckert3); };
  d3.geo.eckert4 = function() { return projection(eckert4); };
  d3.geo.eckert5 = function() { return projection(eckert5); };
  d3.geo.eckert6 = function() { return projection(eckert6); };
  d3.geo.hammer = function() { return projection(hammer, hammerInverse); };
  d3.geo.homolosine = function() { return projection(homolosine, homolosineInverse); };
  d3.geo.kavrayskiy7 = function() { return projection(kavrayskiy7); };
  d3.geo.larrivee = function() { return projection(larrivee); };
  d3.geo.miller = function() { return projection(miller, millerInverse); };
  d3.geo.mollweide = function() { return projection(mollweide, mollweideInverse); };
  d3.geo.nellHammer = function() { return projection(nellHammer); };
  d3.geo.polyconic = function() { return projection(polyconic); };
  d3.geo.robinson = function() { return projection(robinson); };
  d3.geo.sinusoidal = function() { return projection(sinusoidal, sinusoidalInverse); };
  d3.geo.vanDerGrinten = function() { return projection(vanDerGrinten); };
  d3.geo.wagner6 = function() { return projection(wagner6); };
  d3.geo.winkel3 = function() { return projection(winkel3); };
})();
