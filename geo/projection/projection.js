(function() {
  var radians = Math.PI / 180,
      twoOverPi = 2 / Math.PI,
      defaultProjection = d3.geo.path().projection();

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
      (coordinates[0] + λ * twoOverPi) / 2,
      (coordinates[1] + φ) / 2
    ];
  }

  function projection(project) {
    return function() {
      var scale = 150,
          translate = [480, 250];

      function projection(coordinates) {
        coordinates = project(coordinates[0] * radians, coordinates[1] * radians);
        return [
          coordinates[0] * scale + translate[0],
          translate[1] - coordinates[1] * scale
        ];
      }

      projection.scale = function(x) {
        if (!arguments.length) return scale;
        scale = +x;
        return projection;
      };

      projection.translate = function(x) {
        if (!arguments.length) return translate;
        translate = [+x[0], +x[1]];
        return projection;
      };

      return projection;
    };
  }

  d3.geo.graticule = function() {
    var extent = [[-180, -90], [180, 90]],
        step = [22.5, 22.5],
        precision = [2, 2],
        projection = defaultProjection,
        coordinates;

    function graticule(g) {
      if (!coordinates) reset();

      g.selectAll(".longitude,.latitude").remove();

      g.append("g")
          .attr("class", "longitude")
        .selectAll(".line")
          .data(coordinates[0])
        .enter().append("path")
          .attr("class", "line")
          .attr("d", drawOpen);

      g.append("g")
          .attr("class", "latitude")
        .selectAll(".line")
          .data(coordinates[1])
        .enter().append("path")
          .attr("class", "line")
          .attr("d", drawOpen);
    }

    graticule.outline = function(g) {
      if (!coordinates) reset();

      g.selectAll(".outline").remove();

      g.append("g")
          .attr("class", "outline")
        .append("path")
          .datum(coordinates[0][0].concat(coordinates[0][coordinates[0].length - 1].slice().reverse()))
          .attr("class", "line")
          .attr("d", drawClosed);
    };

    function reset() {
      var xSteps = d3.range(extent[0][0], extent[1][0] + precision[0] / 2, precision[0]),
          ySteps = d3.range(extent[0][1], extent[1][1] + precision[1] / 2, precision[1]);
      coordinates = [
        d3.range(extent[0][0], extent[1][0] + step[0] / 2, step[0]).map(function(x) { return ySteps.map(function(y) { return [x, y]; }); }),
        d3.range(extent[0][1], extent[1][1] + step[1] / 2, step[1]).map(function(y) { return xSteps.map(function(x) { return [x, y]; }); })
      ];
    }

    function drawOpen(coordinates) {
      return "M" + coordinates.map(projection).join("L");
    }

    function drawClosed(coordinates) {
      return drawOpen(coordinates) + "Z";
    }

    graticule.projection = function(_) {
      if (!arguments.length) return projection;
      projection = _;
      return graticule;
    };

    graticule.extent = function(_) {
      if (!arguments.length) return extent;
      extent = _;
      coordinates = null;
      return graticule;
    };

    graticule.step = function(_) {
      if (!arguments.length) return step;
      step = _;
      coordinates = null;
      return graticule;
    };

    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = _;
      coordinates = null;
      return graticule;
    };

    return graticule;
  };

  d3.geo.aitoff = projection(aitoff);
  d3.geo.winkel3 = projection(winkel3);
  d3.geo.projection = projection;
})();
