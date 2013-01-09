require("d3");
require("./projection");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("d3.geo.projection");

var π = Math.PI;

suite.addBatch({
  "d3.geo.aitoff": {
    topic: function() {
      return d3.geo.aitoff();
    },
    "projections and inverse projections": function(aitoff) {
      assertEqualInverse(aitoff, [   0,   0], [480,        250]);
      assertEqualInverse(aitoff, [   0, -90], [480,        485.619449]);
      assertEqualInverse(aitoff, [   0,  90], [480,         14.380550]);
      assertEqualInverse(aitoff, [   0, -45], [480,        367.809724]);
      assertEqualInverse(aitoff, [   0,  45], [480,        132.190275]);
      assertEqualInverse(aitoff, [-180,   0], [  8.761101, 250]);
      assertEqualInverse(aitoff, [ 180,   0], [951.238898, 250]);
      assertEqualInverse(aitoff, [-179,  15], [ 27.261952, 189.342293]);
      assertEqualInverse(aitoff, [   1,   1], [482.617728, 247.381972]);
      assertEqualInverse(aitoff, [  45,  87], [489.158099, 21.6821110]);
    }
  },
  "d3.geo.baker": {
    topic: function() {
      return d3.geo.baker();
    },
    "projections and inverse projections": function(baker) {
      assertEqualInverse(baker, [   0,   0], [480,        250]);
      assertEqualInverse(baker, [   0, -90], [480,        583.216220]);
      assertEqualInverse(baker, [   0,  90], [480,        -83.216220]);
      assertEqualInverse(baker, [   0, -45], [480,        382.206038]);
      assertEqualInverse(baker, [   0,  45], [480,        117.793961]);
      assertEqualInverse(baker, [-180,   0], [  8.761101, 250]);
      assertEqualInverse(baker, [ 180,   0], [951.238898, 250]);
      assertEqualInverse(baker, [-179,  15], [ 11.379095, 210.273662]);
      assertEqualInverse(baker, [   1,   1], [482.617993, 247.381873]);
      assertEqualInverse(baker, [  45,  87], [491.265043, -68.859378]);
    }
  },
  "d3.geo.boggs": {
    topic: function() {
      return d3.geo.boggs();
    },
    "projections and inverse projections": function(boggs) {
      assertEqualInverse(boggs, [   0,   0], [480,        250]);
      assertEqualInverse(boggs, [   0, -90], [480,        473.567218]);
      assertEqualInverse(boggs, [   0,  90], [480,         26.432781]);
      assertEqualInverse(boggs, [   0, -45], [480,        371.532657]);
      assertEqualInverse(boggs, [   0,  45], [480,        128.467342]);
      assertEqualInverse(boggs, [-180,   0], [ 32.864228, 250]);
      assertEqualInverse(boggs, [ 180,   0], [927.135771, 250]);
      assertEqualInverse(boggs, [-179,  15], [ 47.500957, 208.708722]);
      assertEqualInverse(boggs, [   1,   1], [482.483785, 247.240908]);
      assertEqualInverse(boggs, [  45,  87], [488.857270,  31.512628]);
    }
  },
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
  "d3.geo.hill": {
    topic: function() {
      return d3.geo.hill();
    },
    "projections and inverse projections": function(hill) {
      assertEqualInverse(hill, [   0,   0], [480,        250]);
      assertEqualInverse(hill, [   0, -90], [480,        416.823782]);
      assertEqualInverse(hill, [   0,  90], [480,         18.873653]);
      assertEqualInverse(hill, [   0, -45], [480,        364.499449]);
      assertEqualInverse(hill, [   0,  45], [480,        113.253357]);
      assertEqualInverse(hill, [-180,   0], [122.993559,  59.760268]);
      assertEqualInverse(hill, [ 180,   0], [837.006440,  59.760268]);
      assertEqualInverse(hill, [-179,  15], [154.461200,  25.636205]);
      assertEqualInverse(hill, [   1,   1], [482.330467, 247.058682]);
      assertEqualInverse(hill, [  45,  87], [508.223694,  17.762871]);
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
  "d3.geo.mollweide": {
    topic: function() {
      return d3.geo.mollweide();
    },
    "projections and inverse projections": function(mollweide) {
      assertEqualInverse(mollweide, [   0,   0], [480,        250]);
      assertEqualInverse(mollweide, [   0, -90], [480,        462.132034]);
      assertEqualInverse(mollweide, [   0,  90], [480,         37.867965]);
      assertEqualInverse(mollweide, [   0, -45], [480,        375.591020]);
      assertEqualInverse(mollweide, [   0,  45], [480,        124.408979]);
      assertEqualInverse(mollweide, [-180,   0], [ 55.735931, 250]);
      assertEqualInverse(mollweide, [ 180,   0], [904.264068, 250]);
      assertEqualInverse(mollweide, [-179,  15], [ 67.028260, 206.573390]);
      assertEqualInverse(mollweide, [   1,   1], [482.356801, 247.092196]);
      assertEqualInverse(mollweide, [  45,  87], [495.642877,  40.187699]);
    }
  },
  "d3.geo.mtFlatPolarParabolic": {
    topic: function() {
      return d3.geo.mtFlatPolarParabolic();
    },
    "projections and inverse projections": function(mtFlatPolarParabolic) {
      assertEqualInverse(mtFlatPolarParabolic, [   0,   0], [480,        250]);
      assertEqualInverse(mtFlatPolarParabolic, [   0, -90], [480,        458.309522]);
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
      assertEqualInverse(mtFlatPolarQuartic, [   0, -90], [480,        448.848144]);
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
      assertEqualInverse(mtFlatPolarSinusoidal, [   0, -90], [480,        465.967909]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   0,  90], [480,         34.032090]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   0, -45], [480,        377.345812]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   0,  45], [480,        122.654187]);
      assertEqualInverse(mtFlatPolarSinusoidal, [-180,   0], [ 48.064181, 250]);
      assertEqualInverse(mtFlatPolarSinusoidal, [ 180,   0], [911.935818, 250]);
      assertEqualInverse(mtFlatPolarSinusoidal, [-179,  15], [ 64.236235, 207.185461]);
      assertEqualInverse(mtFlatPolarSinusoidal, [   1,   1], [482.399298, 247.143795]);
    }
  },
  "d3.geo.naturalEarth": {
    topic: function() {
      return d3.geo.naturalEarth();
    },
    "projections and inverse projections": function(naturalEarth) {
      assertEqualInverse(naturalEarth, [   0,   0], [480,        250]);
      assertEqualInverse(naturalEarth, [   0, -90], [480,        463.358576]);
      assertEqualInverse(naturalEarth, [   0,  90], [480,         36.641423]);
      assertEqualInverse(naturalEarth, [   0, -45], [480,        368.957709]);
      assertEqualInverse(naturalEarth, [   0,  45], [480,        131.042290]);
      assertEqualInverse(naturalEarth, [-180,   0], [ 69.692291, 250]);
      assertEqualInverse(naturalEarth, [ 180,   0], [890.307708, 250]);
      assertEqualInverse(naturalEarth, [-179,  15], [ 76.241138, 210.406263]);
      assertEqualInverse(naturalEarth, [   1,   1], [482.279382, 247.363076]);
      assertEqualInverse(naturalEarth, [  45,  87], [541.511740,  38.772664]);
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
  "d3.geo.robinson": {
    topic: function() {
      return d3.geo.robinson();
    },
    "projections and inverse projections": function(robinson) {
      assertEqualInverse(robinson, [   1,   1], [482.617847, 247.036246]);
      assertEqualInverse(robinson, [  45,  87], [545.397120,  14.047945]);
      assertEqualInverse(robinson, [   0,   0], [480,        250]);
      assertEqualInverse(robinson, [   0, -90], [480,        489.012369]);
      assertEqualInverse(robinson, [   0,  90], [480,         10.987630]);
      assertEqualInverse(robinson, [   0, -45], [480,        383.153790]);
      assertEqualInverse(robinson, [   0,  45], [480,        116.846209]);
      assertEqualInverse(robinson, [-180,   0], [  8.761101, 250]);
      assertEqualInverse(robinson, [ 180,   0], [951.238898, 250]);
      assertEqualInverse(robinson, [-179,  15], [ 16.065304, 205.543699]);
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
      assertEqualInverse(winkel3, [  45,  87], [522.079049,  21.958321]);
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
  var projected;
  assert.inDelta(projected = projection(location), point, 1e-6);
  assert.inDelta(projection.invert(projected), location, 1e-6);
  assert.inDelta(projection(projection.invert(point)), point, 1e-6);
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
