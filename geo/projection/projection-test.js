require("../../test/env");
require("d3");
require("./projection");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.projection");

suite.addBatch({
  "d3.geo.bonne": {
    "40° parallel": {
      topic: function() {
        return d3.geo.bonne().parallel(40);
      },
      "invert(project(location)) equals location": function(bonne) {
        assertEqualInverse(bonne, [   0,   0], [480,        354.719755]);
        assertEqualInverse(bonne, [   0, -90], [480,        590.339204]);
        assertEqualInverse(bonne, [   0,  90], [480,        119.100306]);
        assertEqualInverse(bonne, [   0, -45], [480,        472.529479]);
        assertEqualInverse(bonne, [   0,  45], [480,        236.910030]);
        assertEqualInverse(bonne, [-180,   0], [197.703665,  45.328000]);
        assertEqualInverse(bonne, [ 180,   0], [762.296334,  45.328000]);
        assertEqualInverse(bonne, [-179,  15], [245.482446,   3.108766]);
        assertEqualInverse(bonne, [   1,   1], [482.617557, 352.089563]);
      }
    },
    "90° parallel (Werner)": {
      topic: function() {
        return d3.geo.bonne().parallel(90);
      },
      "invert(project(location)) equals location": function(bonne) {
        assertEqualInverse(bonne, [0, 0], [480, 485.619449]);
      }
    },
    "0° parallel (sinusoidal)": {
      topic: function() {
        return d3.geo.bonne().parallel(0);
      },
      "invert(project(location)) equals location": function(bonne) {
        assertEqualInverse(bonne, [0, 0], [480, 250]);
      }
    }
  }
});

var locations = [
  [   0,   0],
  [   1,   1],
  [   0,  90],
  [   0, -90],
  [   0,  45],
  [   0, -45],
  [  90,   0],
  [-180,   0],
  [ 180,   0],
  [-179,  15],
  [-180,  15],
  [ 180,  15],
  [-180, -90],
  [ 180,  90],
  [ 179,   0],
  [-179,   0],
  [   0,  15]
]

suite.export(module);

function assertEqualInverse(projection, location, point) {
  assert.inDelta(projection(location), point, 1e-6);
  assert.inDelta(projection.invert(point), location, 1e-6);
  assert.inDelta(location, projection.invert(projection(location)), 1e-6);
  assert.inDelta(point, projection(projection.invert(point)), 1e-6);
}
