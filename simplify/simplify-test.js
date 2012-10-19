require("d3");
require("./simplify");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.simplify");

suite.addBatch({
  "d3.simplify": {
    topic: function() {
      var simplify = d3.simplify().area(100).projection(d3.geo.equirectangular());
      return function(d) { return simplify(simplify.project(d)); };
    },
    "LineString": {
      "2 points": function(simplify) {
        var p = {type: "LineString", coordinates: [[0, 0], [1, 1]]};
        assert.deepEqual(simplify(p).coordinates, []); // TODO identity?
      },
      "3 collinear points": function(simplify) {
        var p = {type: "LineString", coordinates: [[0, 0], [1, 1], [45, 45]]};
        assert.deepEqual(simplify(p).coordinates, []); // TODO return first and last points?
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
  }
});

suite.export(module);
