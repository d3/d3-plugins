var vows = require("vows"),
    assert = require("./assert"),
    load = require("./load");

var suite = vows.describe("d3.geo.cahillKeyes");

suite.addBatch({
  "cahillKeyes": {
    topic: load("cahill-keyes"),
    "default": {
      topic: function(geo) { return geo.cahillKeyes(); },
      "projections and inverse projections": function(cahillKeyes) {
        assert.inDelta(cahillKeyes([0,  0]), [480, 250], 1e-6);
      }
    }
  }
});

suite.export(module);
