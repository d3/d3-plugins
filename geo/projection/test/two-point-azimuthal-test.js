var vows = require("vows"),
    assert = require("./assert"),
    load = require("./load");

var suite = vows.describe("d3.geo.twoPointAzimuthal");

suite.addBatch({
  "twoPointAzimuthal": {
    topic: load("two-point-azimuthal"),
    "default": {
      topic: function(geo) { return geo.twoPointAzimuthal(); },
      "projections and inverse projections": function(twoPointAzimuthal) {
        assert.equalInverse(twoPointAzimuthal, [  0,   0], [ 480,        250]);
        assert.equalInverse(twoPointAzimuthal, [  0, -45], [ 480,        400]);
        assert.equalInverse(twoPointAzimuthal, [  0,  45], [ 480,        100]);
        assert.equalInverse(twoPointAzimuthal, [-80,  15], [-370.692272,  18.541314]);
        assert.equalInverse(twoPointAzimuthal, [  1,   1], [ 482.618259, 247.381341]);
        assert.equalInverse(twoPointAzimuthal, [ 15,  45], [ 520.192378,  94.708572]);
      }
    }
  }
});

suite.export(module);
