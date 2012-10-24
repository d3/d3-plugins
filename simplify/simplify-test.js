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
          deepEqual(simplify(p), p);
        },
        "9 points": function(simplify) {
          var p = {type: "LineString", coordinates: [[0, 0], [0, 5], [0, 10], [5, 10], [10, 10], [10, 5], [10, 0], [5, 0], [0, 0]]};
          deepEqual(simplify(p), p);
        }
      },
      "FeatureCollection": {
        "preserves properties": function(simplify) {
          var p = {type: "FeatureCollection", features: [], properties: {name: "test"}};
          deepEqual(simplify(p), p);
        }
      },
      "Feature": {
        "preserves properties": function(simplify) {
          var p = {type: "Feature", geometry: {type: "GeometryCollection", geometries: []}, properties: {name: "test"}};
          deepEqual(simplify(p), p);
        }
      },
      "GeometryCollection": {
        "preserves properties": function(simplify) {
          var p = {type: "GeometryCollection", geometries: [], properties: {name: "test"}};
          deepEqual(simplify(p), p);
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
          deepEqual(simplify(p), p);
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
          deepEqual(simplify(p), p);
        }
      },
      "MultiPolygon": {
        "empty result": function(simplify) {
          var p = {type: "MultiPolygon", coordinates: [[[[0, 0], [1, 1], [1, 0], [0, 0]]]]};
          assert.deepEqual(simplify(p).coordinates, []);
        },
        "1 polygon": function(simplify) {
          var p = {type: "MultiPolygon", coordinates: [[[[0, 0], [10, 10], [10, 0], [0, 0]]]]};
          deepEqual(simplify(p), p);
        }
      },
      "GeometryCollection": {
        "empty result": function(simplify) {
          var p = {type: "GeometryCollection", geometries: [{type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]}]};
          assert.deepEqual(simplify(p).geometries, []);
        },
        "1 polygon": function(simplify) {
          var p = {type: "GeometryCollection", geometries: [{type: "MultiPolygon", coordinates: [[[[0, 0], [10, 10], [10, 0], [0, 0]]]]}]};
          deepEqual(simplify(p), p);
        }
      },
      "FeatureCollection": {
        "empty result": function(simplify) {
          var p = {type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]}}]};
          assert.deepEqual(simplify(p).features, []);
        },
        "1 polygon": function(simplify) {
          var p = {type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "MultiPolygon", coordinates: [[[[0, 0], [10, 10], [10, 0], [0, 0]]]]}}]};
          deepEqual(simplify(p), p);
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

// includes non-enumerable properties
function deepEqual(actual, expected) {
  if (actual === expected) return true;
  if (typeof actual !== "object" && typeof expected !== "object") return actual == expected;
  return objectEqual(actual, expected);
}

function objectEqual(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) return false;
  if (a.prototype !== b.prototype) return false;
  var ka = d3.keys(a),
      kb = d3.keys(b);
  if (ka.length !== kb.length) return false;
  ka.sort();
  kb.sort();
  for (var i = ka.length; --i >= 0;) if (ka[i] !== kb[i]) return false;
  for (var i = ka.length; --i >= 0;) if (!deepEqual(a[ka[i]], b[ka[i]])) return false;
  return true;
}
