require("./env");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.craig");

suite.addBatch({
  "craig": {
    topic: d3.geo.craig,
    "projections and inverse projections": function(craig) {
      assert.inDelta(craig([   0,   0]), [480,          250], 1e-6);
      assert.inDelta(craig([   0, -90]), [480,          400], 1e-6);
      assert.inDelta(craig([   0,  90]), [480,          100], 1e-6);
      assert.inDelta(craig([   0, -45]), [480,          356.066017], 1e-6);
      assert.inDelta(craig([   0,  45]), [480,          143.933982], 1e-6);
      assert.inDelta(craig([-180,   0]), [  8.761101,   250], 1e-6);
      assert.inDelta(craig([ 180,   0]), [951.238898,   250], 1e-6);
      assert.inDelta(craig([-179,  15]), [ 11.3790958, 7198.585721], 1e-6);
      assert.inDelta(craig([   1,   1]), [482.617993,   247.382404], 1e-6);
    }
  }
});

suite.export(module);
