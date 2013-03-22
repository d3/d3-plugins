import "projection";

d3.geo.interrupt = function(project) {
  var lobes = [
    [[[-π, 0], [0,  π / 2], [π, 0]]],
    [[[-π, 0], [0, -π / 2], [π, 0]]]
  ];

  var projection = d3.geo.projection(function(λ, φ) {
    var sign = φ < 0 ? -1 : +1,
        hemilobes = lobes[+(φ < 0)];
    for (var i = 0, n = hemilobes.length - 1; i < n && λ > hemilobes[i][2][0]; ++i);
    var coordinates = project(λ - hemilobes[i][1][0], φ);
    coordinates[0] += project(hemilobes[i][1][0], sign * φ > sign * hemilobes[i][0][1] ? hemilobes[i][0][1] : φ)[0];
    return coordinates;
  });

  var stream_ = projection.stream;

  projection.stream = function(stream) {
    var rotate = projection.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (projection.rotate([0, 0]), stream_(stream));
    projection.rotate(rotate);
    rotateStream.sphere = function() { d3.geo.stream(sphere(), sphereStream); };
    return rotateStream;
  };

  projection.lobes = function(_) {
    if (!arguments.length) return lobes.map(function(lobes) {
      return lobes.map(function(lobe) {
        return [
          [lobe[0][0] * 180 / π, lobe[0][1] * 180 / π],
          [lobe[1][0] * 180 / π, lobe[1][1] * 180 / π],
          [lobe[2][0] * 180 / π, lobe[2][1] * 180 / π]
        ];
      });
    });
    lobes = _.map(function(lobes) {
      return lobes.map(function(lobe) {
        return [
          [lobe[0][0] * π / 180, lobe[0][1] * π / 180],
          [lobe[1][0] * π / 180, lobe[1][1] * π / 180],
          [lobe[2][0] * π / 180, lobe[2][1] * π / 180]
        ];
      });
    });
    return projection;
  };

  function sphere() {
    var ε = 1e-6,
        coordinates = [];

    // Northern Hemisphere
    for (var i = 0, n = lobes[0].length; i < n; ++i) {
      var lobe = lobes[0][i],
          λ0 = lobe[0][0] * 180 / π,
          φ0 = lobe[0][1] * 180 / π,
          φ1 = lobe[1][1] * 180 / π,
          λ2 = lobe[2][0] * 180 / π,
          φ2 = lobe[2][1] * 180 / π;
      coordinates.push(resample([
        [λ0 + ε, φ0 + ε],
        [λ0 + ε, φ1 - ε],
        [λ2 - ε, φ1 - ε],
        [λ2 - ε, φ2 + ε]
      ], 30));
    }

    // Southern Hemisphere
    for (var i = lobes[1].length - 1; i >= 0; --i) {
      var lobe = lobes[1][i],
          λ0 = lobe[0][0] * 180 / π,
          φ0 = lobe[0][1] * 180 / π,
          φ1 = lobe[1][1] * 180 / π,
          λ2 = lobe[2][0] * 180 / π,
          φ2 = lobe[2][1] * 180 / π;
      coordinates.push(resample([
        [λ2 - ε, φ2 - ε],
        [λ2 - ε, φ1 + ε],
        [λ0 + ε, φ1 + ε],
        [λ0 + ε, φ0 - ε]
      ], 30));
    }

    return {
      type: "Polygon",
      coordinates: [d3.merge(coordinates)]
    };
  }

  function resample(coordinates, m) {
    var i = -1,
        n = coordinates.length,
        p0 = coordinates[0],
        p1,
        dx,
        dy,
        resampled = [];
    while (++i < n) {
      p1 = coordinates[i];
      dx = (p1[0] - p0[0]) / m;
      dy = (p1[1] - p0[1]) / m;
      for (var j = 0; j < m; ++j) resampled.push([p0[0] + j * dx, p0[1] + j * dy]);
      p0 = p1;
    }
    resampled.push(p1);
    return resampled;
  }

  return projection;
};
