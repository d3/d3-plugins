require("./env");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.transverseMercator");

suite.addBatch({
  "transverseMercator": {
    topic: d3.geo.transverseMercator,
    "projections and inverse projections": function(transverseMercator) {
      assert.equalInverse(transverseMercator, [  0,   0], [480,        250]);
      assert.equalInverse(transverseMercator, [  0, -45], [480,        367.809724]);
      assert.equalInverse(transverseMercator, [  0,  45], [480,        132.190275]);
      assert.equalInverse(transverseMercator, [-90,   0], [-Infinity,  250]);
      assert.equalInverse(transverseMercator, [ 90,   0], [ Infinity,  250]);
      assert.equalInverse(transverseMercator, [-80,  15], [203.284019, 100.632486]);
      assert.equalInverse(transverseMercator, [  1,   1], [482.617727, 247.381607]);
      assert.equalInverse(transverseMercator, [ 15,  45], [507.764703, 129.590678]);
      assert.equalInverse(transverseMercator, [  0,  90], [480,         14.380550]);
      assert.equalInverse(transverseMercator, [  0, -90], [480,        485.619449]);
      assert.equalInverse(transverseMercator, [180,   0], [480,       -221.238898]);
    }
  }
});

suite.export(module);
