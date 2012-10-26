require("d3");
require("./projection");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.projection");

var π = Math.PI;

suite.addBatch({
  "d3.geo.bonne": {
    "40° parallel": {
      topic: function() {
        return d3.geo.bonne().parallel(40);
      },
      "projections and inverse projections": function(bonne) {
        assertEqualInverse(bonne, [   0,   0], [480,         250]);
        assertEqualInverse(bonne, [   0, -90], [480,         485.619449]);
        assertEqualInverse(bonne, [   0,  90], [480,          14.380550]);
        assertEqualInverse(bonne, [   0, -45], [480,         367.809724]);
        assertEqualInverse(bonne, [   0,  45], [480,         132.190275]);
        assertEqualInverse(bonne, [-180,   0], [197.703665,  -59.391754]);
        assertEqualInverse(bonne, [ 180,   0], [762.296334,  -59.391754]);
        assertEqualInverse(bonne, [-179,  15], [245.482446, -101.610988]);
        assertEqualInverse(bonne, [   1,   1], [482.617557,  247.369808]);
      }
    },
    "90° parallel (Werner)": {
      topic: function() {
        return d3.geo.bonne().parallel(90);
      },
      "projections and inverse projections": function(bonne) {
        assertEqualInverse(bonne, [0, 0], [480, 250]);
      }
    },
    "0° parallel (sinusoidal)": {
      topic: function() {
        return d3.geo.bonne().parallel(0);
      },
      "projections and inverse projections": function(bonne) {
        assertEqualInverse(bonne, [0, 0], [480, 250]);
      }
    }
  },
  "d3.geo.hatano": {
    topic: function() {
      return d3.geo.hatano();
    },
    "projections and inverse projections": function(hatano) {
      assertEqualInverse(hatano, [   0,   0], [480,        250]);
      assertEqualInverse(hatano, [   0, -90], [480,        441.538303]);
      assertEqualInverse(hatano, [   0,  90], [480,         53.383198]);
      assertEqualInverse(hatano, [   0, -45], [480,        379.209449]);
      assertEqualInverse(hatano, [   0,  45], [480,        119.704758]);
      assertEqualInverse(hatano, [-180,   0], [ 79.446936, 250]);
      assertEqualInverse(hatano, [ 180,   0], [880.553063, 250]);
      assertEqualInverse(hatano, [-179,  15], [87.7505160, 204.093101]);
      assertEqualInverse(hatano, [   1,   1], [482.225143, 246.920082]);
    }
  },
  "d3.geo.larrivee": {
    topic: function() {
      return d3.geo.larrivee();
    },
    "projections and inverse projections": function(larrivee) {
      assertEqualInverse(larrivee, [   0,   0], [480,        250]);
      assertEqualInverse(larrivee, [   0, -90], [480,        583.216220]);
      assertEqualInverse(larrivee, [   0,  90], [480,        -83.216220]);
      assertEqualInverse(larrivee, [   0, -45], [480,        377.516326]);
      assertEqualInverse(larrivee, [   0,  45], [480,        122.483673]);
      assertEqualInverse(larrivee, [-180,   0], [  8.761101, 250]);
      assertEqualInverse(larrivee, [ 180,   0], [951.238898, 250]);
      assertEqualInverse(larrivee, [-179,  15], [ 15.405661, 204.340225]);
      assertEqualInverse(larrivee, [   1,   1], [482.617894, 247.381895]);
    }
  },
  "d3.geo.loximuthal": {
    topic: function() {
      return d3.geo.loximuthal();
    },
    "projections and inverse projections": function(loximuthal) {
      assertEqualInverse(loximuthal, [   0,   0], [480,        250]);
      assertEqualInverse(loximuthal, [   0, -90], [480,        485.619449]);
      assertEqualInverse(loximuthal, [   0,  90], [480,         14.380550]);
      assertEqualInverse(loximuthal, [   0, -45], [480,        367.809724]);
      assertEqualInverse(loximuthal, [   0,  45], [480,        132.190275]);
      assertEqualInverse(loximuthal, [-180,   0], [ 48.773559, 250]);
      assertEqualInverse(loximuthal, [ 180,   0], [911.226440, 250]);
      assertEqualInverse(loximuthal, [-179,  15], [69.4643149, 210.730091]);
      assertEqualInverse(loximuthal, [   1,   1], [482.390500, 247.382006]);
    }
  },
  "d3.geo.wagner6": {
    topic: function() {
      return d3.geo.wagner6();
    },
    "projections and inverse projections": function(wagner6) {
      assertEqualInverse(wagner6, [   0,   0], [480,        250]);
      assertEqualInverse(wagner6, [   0, -90], [480,        485.619449]);
      assertEqualInverse(wagner6, [   0,  90], [480,         14.380550]);
      assertEqualInverse(wagner6, [   0, -45], [480,        367.809724]);
      assertEqualInverse(wagner6, [   0,  45], [480,        132.190275]);
      assertEqualInverse(wagner6, [-180,   0], [  8.761101, 250]);
      assertEqualInverse(wagner6, [ 180,   0], [951.238898, 250]);
      assertEqualInverse(wagner6, [-179,  15], [16.2862562, 210.730091]);
      assertEqualInverse(wagner6, [   1,   1], [482.617872, 247.382006]);
    }
  },
  // TODO move to D3 core?
  "rotate": {
    "identity": {
      topic: function() {
        return d3.geo.equirectangular().rotate([0, 0]).translate([0, 0]).scale(1);
      },
      "projections and inverse projections": function(projection) {
        assertEqualInverse(projection, [   0,   0], [ 0,  0]);
        assertEqualInverse(projection, [-180,   0], [-π,  0]);
        assertEqualInverse(projection, [ 180,   0], [ π,  0]);
        assertEqualInverse(projection, [   0,  30], [ 0, -π / 6]);
        assertEqualInverse(projection, [   0, -30], [ 0,  π / 6]);
        assertEqualInverse(projection, [  30,  30], [ π / 6, -π / 6]);
        assertEqualInverse(projection, [  30, -30], [ π / 6,  π / 6]);
        assertEqualInverse(projection, [ -30,  30], [-π / 6, -π / 6]);
        assertEqualInverse(projection, [ -30, -30], [-π / 6,  π / 6]);
      }
    },
    "[30, 0]": {
      topic: function() {
        return d3.geo.equirectangular().rotate([30, 0]).translate([0, 0]).scale(1);
      },
      "projections and inverse projections": function(projection) {
        assertEqualInverse(projection, [   0,   0], [ π / 6,  0]);
        assertEqualInverse(projection, [-180,   0], [-5 / 6 * π,  0]);
        assert.inDelta(    projection( [ 180,   0]),[-5 / 6 * π,  0], 1e-6); // inverse is [-180, 0]
        assertEqualInverse(projection, [   0,  30], [ π / 6, -π / 6]);
        assertEqualInverse(projection, [   0, -30], [ π / 6,  π / 6]);
        assertEqualInverse(projection, [  30,  30], [ π / 3, -π / 6]);
        assertEqualInverse(projection, [  30, -30], [ π / 3,  π / 6]);
        assertEqualInverse(projection, [ -30,  30], [ 0    , -π / 6]);
        assertEqualInverse(projection, [ -30, -30], [ 0    ,  π / 6]);
      }
    },
    "[30, 30]": {
      topic: function() {
        return d3.geo.equirectangular().rotate([30, 30]).translate([0, 0]).scale(1);
      },
      "projections and inverse projections": function(projection) {
        assertEqualInverse(projection, [   0,   0], [ 0.5880026035475674, -0.44783239692893245]);
        assertEqualInverse(projection, [-180,   0], [-2.5535900500422257,  0.44783239692893245]);
        assert.inDelta(    projection( [ 180,   0]),[-2.5535900500422257,  0.44783239692893245], 1e-6); // inverse is [-180, 0]
        assertEqualInverse(projection, [   0,  30], [ 0.8256075561643480, -0.94077119517052080]);
        assertEqualInverse(projection, [   0, -30], [ 0.4486429615608479,  0.05804529130778048]);
        assertEqualInverse(projection, [  30,  30], [ 1.4056476493802694, -0.70695172788721770]);
        assertEqualInverse(projection, [  30, -30], [ 0.8760580505981933,  0.21823451436745955]);
        assertEqualInverse(projection, [ -30,  30], [ 0,                  -1.04719755119659760]);
        assertEqualInverse(projection, [ -30, -30], [ 0,                   0]);
      }
    },
    "[0, 0, 30]": {
      topic: function() {
        return d3.geo.equirectangular().rotate([0, 0, 30]).translate([0, 0]).scale(1);
      },
      "projections and inverse projections": function(projection) {
        assertEqualInverse(projection, [   0,   0], [ 0, 0]);
        assertEqualInverse(projection, [-180,   0], [-π, 0]);
        assertEqualInverse(projection, [ 180,   0], [ π, 0]);
        assertEqualInverse(projection, [   0,  30], [-0.2810349015028135, -0.44783239692893245]);
        assertEqualInverse(projection, [   0, -30], [ 0.2810349015028135,  0.44783239692893245]);
        assertEqualInverse(projection, [  30,  30], [ 0.1651486774146268, -0.70695172788721760]);
        assertEqualInverse(projection, [  30, -30], [ 0.6947382761967031,  0.21823451436745964]);
        assertEqualInverse(projection, [ -30,  30], [-0.6947382761967031, -0.21823451436745964]);
        assertEqualInverse(projection, [ -30, -30], [-0.1651486774146268,  0.70695172788721760]);
      }
    },
    "[30, 30, 30]": {
      topic: function() {
        return d3.geo.equirectangular().rotate([30, 30, 30]).translate([0, 0]).scale(1);
      },
      "projections and inverse projections": function(projection) {
        assertEqualInverse(projection, [   0,   0], [ 0.2810349015028135, -0.67513153293703170]);
        assertEqualInverse(projection, [-180,   0], [-2.8605577520869800,  0.67513153293703170]);
        assert.inDelta(    projection( [ 180,   0]),[-2.8605577520869800,  0.67513153293703170], 1e-6); // inverse is [-180, 0]
        assertEqualInverse(projection, [   0,  30], [-0.0724760059270816, -1.15865677086597720]);
        assertEqualInverse(projection, [   0, -30], [ 0.4221351552567053, -0.16704161863132252]);
        assertEqualInverse(projection, [  30,  30], [ 1.2033744221750944, -1.21537512510467320]);
        assertEqualInverse(projection, [  30, -30], [ 0.8811235701944905, -0.18861638617540410]);
        assertEqualInverse(projection, [ -30,  30], [-0.7137243789447654, -0.84806207898148100]);
        assertEqualInverse(projection, [ -30, -30], [ 0,                   0]);
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

function assertEqualInverse(projection, location, point) {
  assert.inDelta(projection(location), point, 1e-6);
  assert.inDelta(projection.invert(point), location, 1e-6);
  assert.inDelta(location, projection.invert(projection(location)), 1e-6);
  assert.inDelta(point, projection(projection.invert(point)), 1e-6);
}

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
