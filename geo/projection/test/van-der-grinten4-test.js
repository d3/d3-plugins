require("./env");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.vanDerGrinten4");

suite.addBatch({
  "vanDerGrinten4": {
    topic: d3.geo.vanDerGrinten4,
    "doesn't generate NaN": function(vanDerGrinten4) {
      assert.inDelta(vanDerGrinten4([20, 1e-7]), [532.359877, 250], 1e-6);
    }
  }
});

suite.export(module);
