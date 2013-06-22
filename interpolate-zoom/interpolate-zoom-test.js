var vows = require("vows"),
    assert = require("assert");

global.d3 = require("d3");
require("./interpolate-zoom");

var suite = vows.describe("d3.interpolateZoom");

suite.addBatch({
  "interpolateZoom": {
    topic: function() { return d3.interpolateZoom; },
    "identity": function(interpolate) {
      var i = interpolate([1, 1, 1], [1, 1, 1]);
      assert.deepEqual(i(0), [1, 1, 1]);
      assert.deepEqual(i(.5), [1, 1, 1]);
      assert.deepEqual(i(1), [1, 1, 1]);
    },
    "ux0 almost equal to ux1": function(interpolate) {
      var i = interpolate([6317.937500000001, 9242.5, 2], [6317.9375, 9242.5, 5]);
      assert.deepEqual(i(0), [6317.937500000001, 9242.5, 2]);
      assert.deepEqual(i(.5), [6317.9375, 9242.5, 3.162277660168379]);
      assert.deepEqual(i(1), [6317.9375, 9242.5, 5]);
    }
  }
});

suite.export(module);
