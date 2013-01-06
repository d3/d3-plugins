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
  "d3.geo.craig": {
    topic: function() {
      return d3.geo.craig();
    },
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
  },
  "d3.geo.craster": {
    topic: function() {
      return d3.geo.craster();
    },
    "projections and inverse projections": function(craster) {
      assertEqualInverse(craster, [   0,   0], [480,        250]);
      assertEqualInverse(craster, [   0, -90], [480,        480.248509]);
      assertEqualInverse(craster, [   0,  90], [480,         19.751490]);
      assertEqualInverse(craster, [   0, -45], [480,        369.185398]);
      assertEqualInverse(craster, [   0,  45], [480,        130.814601]);
      assertEqualInverse(craster, [-180,   0], [ 19.502981, 250]);
      assertEqualInverse(craster, [ 180,   0], [940.497018, 250]);
      assertEqualInverse(craster, [-179,  15], [ 35.975533, 209.865040]);
      assertEqualInverse(craster, [   1,   1], [482.557970, 247.320952]);
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
  "d3.geo.mtFlatPolarParabolic": {
    topic: function() {
      return d3.geo.mtFlatPolarParabolic();
    },
    "projections and inverse projections": function(mtFlatPolarParabolic) {
      assertEqualInverse(mtFlatPolarParabolic, [   0,   0], [480,        250]);
      assertEqualInverse(mtFlatPolarParabolic, [   0, -90], [480,        458.30952244882417]);
      assertEqualInverse(mtFlatPolarParabolic, [   0,  90], [480,         41.690477]);
      assertEqualInverse(mtFlatPolarParabolic, [   0, -45], [480,        374.430617]);
      assertEqualInverse(mtFlatPolarParabolic, [   0,  45], [480,        125.569382]);
      assertEqualInverse(mtFlatPolarParabolic, [-180,   0], [ 43.717556, 250]);
      assertEqualInverse(mtFlatPolarParabolic, [ 180,   0], [916.282443, 250]);
      assertEqualInverse(mtFlatPolarParabolic, [-179,  15], [ 58.080254, 207.678319]);
      assertEqualInverse(mtFlatPolarParabolic, [   1,   1], [482.423493, 247.172271]);
    }
  },
  "d3.geo.mtFlatPolarQuartic": {
    topic: function() {
      return d3.geo.mtFlatPolarQuartic();
    },
    "projections and inverse projections": function(mtFlatPolarQuartic) {
      assertEqualInverse(mtFlatPolarQuartic, [   0,   0], [480,        250]);
      assertEqualInverse(mtFlatPolarQuartic, [   0, -90], [480,        448.8481444213551]);
      assertEqualInverse(mtFlatPolarQuartic, [   0,  90], [480,         51.151855]);
      assertEqualInverse(mtFlatPolarQuartic, [   0, -45], [480,        371.001020]);
      assertEqualInverse(mtFlatPolarQuartic, [   0,  45], [480,        128.998979]);
      assertEqualInverse(mtFlatPolarQuartic, [-180,   0], [146.783779, 250]);
      assertEqualInverse(mtFlatPolarQuartic, [ 180,   0], [813.216220, 250]);
      assertEqualInverse(mtFlatPolarQuartic, [-179,  15], [155.997702, 208.275733]);
      assertEqualInverse(mtFlatPolarQuartic, [   1,   1], [481.851018, 247.207163]);
    }
  },
  "d3.geo.mtFlatPolarSinusoidal": {
    topic: function() {
      return d3.geo.mtFlatPolarSinusoidal();
    },
    "projections and inverse projections": function(mtFlatPolarSinusoidal) {
      assertEqualInverse(mtFlatPolarSinusoidal, [   0,   0], [480,        250]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   0, -90], [480,        465.96790915007875]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   0,  90], [480,         34.032090]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   0, -45], [480,        377.345812]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   0,  45], [480,        122.654187]);
      assertEqualInverse(mtFlatPolarSinusoidal, [-180,   0], [ 48.064181, 250]);
      assertEqualInverse(mtFlatPolarSinusoidal, [ 180,   0], [911.935818, 250]);
      assertEqualInverse(mtFlatPolarSinusoidal, [-179,  15], [ 64.236235, 207.185461]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   1,   1], [482.399298, 247.143795]);
    }
  },
  "d3.geo.quarticAuthalic": {
    topic: function() {
      return d3.geo.quarticAuthalic();
    },
    "projections and inverse projections": function(quarticAuthalic) {
      assertEqualInverse(quarticAuthalic, [   0,   0], [480,        250]);
      assertEqualInverse(quarticAuthalic, [   0, -90], [480,        462.132034]);
      assertEqualInverse(quarticAuthalic, [   0,  90], [480,         37.867965]);
      assertEqualInverse(quarticAuthalic, [   0, -45], [480,        364.805029]);
      assertEqualInverse(quarticAuthalic, [   0,  45], [480,        135.194970]);
      assertEqualInverse(quarticAuthalic, [-180,   0], [  8.761101, 250]);
      assertEqualInverse(quarticAuthalic, [ 180,   0], [951.238898, 250]);
      assertEqualInverse(quarticAuthalic, [-179,  15], [ 23.441040, 210.842142]);
      assertEqualInverse(quarticAuthalic, [   1,   1], [482.617694, 247.382039]);
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
  "d3.geo.winkel3": {
    topic: function() {
      return d3.geo.winkel3();
    },
    "projections and inverse projections": function(winkel3) {
      assertEqualInverse(winkel3, [   0,   0], [480,        250]);
      assertEqualInverse(winkel3, [   0, -90], [480,        485.619449]);
      assertEqualInverse(winkel3, [   0,  90], [480,         14.380550]);
      assertEqualInverse(winkel3, [   0, -45], [480,        367.809724]);
      assertEqualInverse(winkel3, [   0,  45], [480,        132.190275]);
      assertEqualInverse(winkel3, [-180,   0], [ 94.380550, 250]);
      assertEqualInverse(winkel3, [ 180,   0], [865.619449, 250]);
      assertEqualInverse(winkel3, [-179,  15], [104.464309, 200.036192]);
      assertEqualInverse(winkel3, [   1,   1], [482.142197, 247.381989]);
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

function assertEqualInverse(projection, location, point, delta) {
  delta = delta || 1e-6;
  assert.inDelta(projection(location), point, delta);
  assert.inDelta(projection.invert(point), location, delta);
  assert.inDelta(location, projection.invert(projection(location)), delta);
  assert.inDelta(point, projection(projection.invert(point)), delta);
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
