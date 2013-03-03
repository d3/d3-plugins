require("./env");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.auxiliary.latitude");

var π = Math.PI;

suite.addBatch({
  "auxiliary": {
    "conformal": {
      topic: function() {
        return d3.geo.auxiliary.latitude.conformal(.01);
      },
      "forward and inverse": function(latitude) {
        assert.inDelta(latitude.invert(latitude(0)), 0, 1e-6);
        assert.inDelta(latitude.invert(latitude(.1)), .1, 1e-6);
        assert.inDelta(latitude.invert(latitude(π / 4)), π / 4, 1e-6);
        assert.inDelta(latitude.invert(latitude(π / 2)), π / 2, 1e-6);
        assert.inDelta(latitude.invert(latitude(-π / 4)), -π / 4, 1e-6);
        assert.inDelta(latitude.invert(latitude(-π / 2)), -π / 2, 1e-6);
      }
    },
    "isometric": {
      topic: function() {
        return d3.geo.auxiliary.latitude.isometric(.01);
      },
      "forward and inverse": function(latitude) {
        assert.inDelta(latitude.invert(latitude(0)), 0, 1e-6);
        assert.inDelta(latitude.invert(latitude(.1)), .1, 1e-6);
        assert.inDelta(latitude.invert(latitude(π / 4)), π / 4, 1e-6);
        assert.inDelta(latitude.invert(latitude(π / 2)), π / 2, 1e-6);
        assert.inDelta(latitude.invert(latitude(-π / 4)), -π / 4, 1e-6);
        assert.inDelta(latitude.invert(latitude(-π / 2)), -π / 2, 1e-6);
      }
    },
    "authalic": {
      topic: function() {
        return d3.geo.auxiliary.latitude.authalic(.01);
      },
      "forward and inverse": function(latitude) {
        assert.inDelta(latitude.invert(latitude(0)), 0, 1e-6);
        assert.inDelta(latitude.invert(latitude(.1)), .1, 1e-6);
        assert.inDelta(latitude.invert(latitude(π / 4)), π / 4, 1e-6);
        assert.inDelta(latitude.invert(latitude(π / 2)), π / 2, 1e-6);
        assert.inDelta(latitude.invert(latitude(-π / 4)), -π / 4, 1e-6);
        assert.inDelta(latitude.invert(latitude(-π / 2)), -π / 2, 1e-6);
      }
    }
  }
});

suite.export(module);
