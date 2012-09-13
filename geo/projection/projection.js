(function() {
  var π = Math.PI,
      defaultProjection = d3.geo.path().projection();

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

  function cylindricalEqualArea() {
    var φ0 = 0,
        cosφ0 = Math.cos(φ0);

    var p = projection(function(λ, φ) {
      return [
        λ * cosφ0,
        Math.sin(φ) / cosφ0
      ];
    });

    p.parallel = function(_) {
      if (!arguments.length) return φ0 * 180 / π;
      cosφ0 = Math.cos(φ0 = _ * π / 180);
      return p;
    };

    return p;
  }

  function sinusoidal(λ, φ) {
    return [
      λ * Math.cos(φ),
      φ
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

  function mollweide(λ, φ) {
    if (Math.abs(φ) !== π / 2) {
      var k = π / 2 * Math.sin(φ);
      for (var i = 0, δ, ε = 1e-6; i < 10; i++) {
        δ = (φ + Math.sin(2 * φ) / 2 - k) / (1 + Math.cos(2 * φ));
        if (Math.abs(δ) < ε) break;
        φ -= δ;
      }
    }
    return [
      2 * Math.SQRT2 / π * λ * Math.cos(φ),
      Math.SQRT2 * Math.sin(φ)
    ];
  }

  function projection(project) {
    var scale = 150,
        translate = [480, 250];

    function p(coordinates) {
      coordinates = project(coordinates[0] * π / 180, coordinates[1] * π / 180);
      return [coordinates[0] * scale + translate[0], translate[1] - coordinates[1] * scale];
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
          xLine0 = ySteps.map(function(y) { return [extent[0][0], y]; }),
          xLine1 = ySteps.map(function(y) { return [extent[1][0], y]; }).reverse();
      xLine1.push(xLine0[0]); // closing coordinate
      return {
        type: "Polygon",
        coordinates: [xLine0.concat(xLine1)]
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
  d3.geo.cylindricalEqualArea = cylindricalEqualArea;
  d3.geo.hammer = function() { return projection(hammer); };
  d3.geo.kavrayskiy7 = function() { return projection(kavrayskiy7); };
  d3.geo.mollweide = function() { return projection(mollweide); };
  d3.geo.robinson = function() { return projection(robinson); };
  d3.geo.sinusoidal = function() { return projection(sinusoidal); };
  d3.geo.wagner6 = function() { return projection(wagner6); };
  d3.geo.winkel3 = function() { return projection(winkel3); };
})();
