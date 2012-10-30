require("d3");
require("./simplify");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.simplify");

suite.addBatch({
  "d3.simplify": {
    "area(0)": {
      topic: function() {
        var simplify = d3.simplify().area(0).projection(d3.geo.equirectangular());
        return function(d) { return simplify(simplify.project(d)); };
      },
      "LineString": {
        "2 points": function(simplify) {
          var p = {type: "LineString", coordinates: [[0, 0], [1, 1]]};
          assert.deepEqual(simplify(p), p);
        },
        "9 points": function(simplify) {
          var p = {type: "LineString", coordinates: [[0, 0], [0, 5], [0, 10], [5, 10], [10, 10], [10, 5], [10, 0], [5, 0], [0, 0]]};
          assert.deepEqual(simplify(p), p);
        }
      },
      "FeatureCollection": {
        "preserves properties": function(simplify) {
          var p = {type: "FeatureCollection", features: [], id: "test"};
          assert.deepEqual(simplify(p), p);
        }
      },
      "Feature": {
        "preserves properties": function(simplify) {
          var p = {type: "Feature", geometry: {type: "GeometryCollection", geometries: []}, properties: {name: "test"}, id: "test"};
          assert.deepEqual(simplify(p), p);
        }
      },
      "GeometryCollection": {
        "preserves properties": function(simplify) {
          var p = {type: "GeometryCollection", geometries: [], id: "test"};
          assert.deepEqual(simplify(p), p);
        }
      }
    },
    "area(10)": {
      topic: function() {
        var simplify = d3.simplify().area(10).projection(d3.geo.equirectangular());
        return function(d) { return simplify(simplify.project(d)); };
      },
      "LineString": {
        "2 points": function(simplify) {
          var p = {type: "LineString", coordinates: [[0, 0], [1, 1]]};
          assert.deepEqual(simplify(p).coordinates, []);
        },
        "3 collinear points": function(simplify) {
          var p = {type: "LineString", coordinates: [[0, 0], [1, 1], [45, 45]]};
          assert.deepEqual(simplify(p).coordinates, []);
        },
        "3 points": function(simplify) {
          var p = {type: "LineString", coordinates: [[0, 0], [10, 10], [0, 20]]};
          assert.deepEqual(simplify(p), p);
        }
      },
      "MultiLineString": {
        "1 line": {
          "3 collinear points": function(simplify) {
            var p = {type: "MultiLineString", coordinates: [[[0, 0], [1, 1], [2, 2]]]};
            assert.deepEqual(simplify(p).coordinates, []);
          }
        },
        "2 lines": function(simplify) {
          var p = {type: "MultiLineString", coordinates: [[[0, 0], [1, 1], [0, 2]], [[10, 0], [15, 15], [20, 0]]]};
          assert.deepEqual(simplify(p).coordinates, [p.coordinates[1]]);
        }
      },
      "Polygon": {
        "empty result": function(simplify) {
          var p = {type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]};
          assert.deepEqual(simplify(p).coordinates, []);
        },
        "1 ring": function(simplify) {
          // TODO verify that LinearRings all have >= 4 points?
          var p = {type: "Polygon", coordinates: [[[0, 0], [10, 10], [10, 0], [0, 0]]]};
          assert.deepEqual(simplify(p), p);
        }
      },
      "MultiPolygon": {
        "empty result": function(simplify) {
          var p = {type: "MultiPolygon", coordinates: [[[[0, 0], [1, 1], [1, 0], [0, 0]]]]};
          assert.deepEqual(simplify(p).coordinates, []);
        },
        "1 polygon": function(simplify) {
          var p = {type: "MultiPolygon", coordinates: [[[[0, 0], [10, 10], [10, 0], [0, 0]]]]};
          assert.deepEqual(simplify(p), p);
        }
      },
      "GeometryCollection": {
        "empty result": function(simplify) {
          var p = {type: "GeometryCollection", geometries: [{type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]}]};
          assert.deepEqual(simplify(p).geometries, []);
        },
        "1 polygon": function(simplify) {
          var p = {type: "GeometryCollection", geometries: [{type: "MultiPolygon", coordinates: [[[[0, 0], [10, 10], [10, 0], [0, 0]]]]}]};
          assert.deepEqual(simplify(p), p);
        }
      },
      "FeatureCollection": {
        "empty result": function(simplify) {
          var p = {type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]}}]};
          assert.deepEqual(simplify(p).features, []);
        },
        "1 polygon": function(simplify) {
          var p = {type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "MultiPolygon", coordinates: [[[[0, 0], [10, 10], [10, 0], [0, 0]]]]}}]};
          assert.deepEqual(simplify(p), p);
        }
      }
    },
    "topology": {
      topic: function() {
        var simplify = d3.simplify().topology(true).area(10).projection(d3.geo.equirectangular());
        return function(d) { return simplify(simplify.project(d)); };
      },
      "Polygon": {
        "preserves topology": function(simplify) {
          assert.inDelta(simplify({
              type: "GeometryCollection",
              geometries: [
                {type: "Polygon", coordinates: [octagon(-2)]},
                {type: "Polygon", coordinates: [octagon(2)]}
              ]
            }).geometries.map(function(d) { return d.coordinates; }), [[[
                [474.444444, 250,        19.290123],
                [475.833333, 247.222222, 13.503086],
                [480,        248.611111, 19.290123],
                [480,        250,        19.290123],
                [480,        251.388888, 19.290123],
                [475.833333, 252.777777, 13.503086],
                [474.444444, 250,        19.290123]]], [[
                [480,        250,        19.290123],
                [480,        248.611111, 19.290123],
                [485.555555, 248.611111, 19.290123],
                [484.166666, 252.777777, 19.290123],
                [480,        251.388888, 19.290123],
                [480,        250,        19.290123]]]
            ], 1e-6);
        },
        "doesn't increase effective area of endpoints unless they touch another line": function(simplify) {
          assert.inDelta(simplify({type: "Polygon", coordinates: [octagon()]}).coordinates, [[
            [477.222222, 250,        21.219135],
            [478.611111, 247.222222, 13.503086],
            [482.777777, 248.611111, 21.219135],
            [481.388888, 252.777777, 21.219135],
            [477.222222, 250,        21.219135]
          ]], 1e-6);
        }
      }
    }
  }
});

suite.export(module);

assert.inDelta = function(actual, expected, delta, message) {
  if (!inDelta(actual, expected, delta)) {
    assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDelta);
  }
};

function inDelta(actual, expected, delta) {
  return (Array.isArray(expected) ? inDeltaArray : inDeltaNumber)(actual, expected, delta);
}

function inDeltaArray(actual, expected, delta) {
  var n = expected.length, i = -1;
  if (actual.length !== n) return false;
  while (++i < n) if (!inDelta(actual[i], expected[i], delta)) return false;
  return true;
}

function inDeltaNumber(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}

function octagon(dx) {
  dx = dx || 0;
  return [
    [-2, 0], [-2,  1], [-1,  2], [0,  2], [ 1,  2], [ 2,  1],
    [ 2, 0], [ 2, -1], [ 1, -2], [0, -2], [-1, -2], [-2, -1],
    [-2, 0]
  ].map(function(point) {
    return [point[0] + dx, point[1]];
  });
}
