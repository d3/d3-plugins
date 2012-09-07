(function() {
  var radians = Math.PI / 180,
      twoOverPi = 2 / Math.PI;

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

  d3.geo.aitoff = projection(aitoff);
  d3.geo.winkel3 = projection(winkel3);
})();
