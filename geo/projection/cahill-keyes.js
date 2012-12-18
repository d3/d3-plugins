(function() {
  var π = Math.PI,
      sqrtπ = Math.sqrt(π);

  function cahillKeyes(λ, φ) {
    // λ, φ are in radians.
    var d3_geo_degrees = 180 / Math.PI;
    var d3_geo_radians = Math.PI / 180;
    var cahillKeyesConstants = {"sin60" : 0.866025403784439,
                                "cos60" : 0.5,
                                "yTranslate" : 8660.25403784439,
                                "pointA" : [940, 0],
                                "pointB" : [2224.06387955737, 1284.06387955737],
                                "pointC" : [2672.81110719659, 1543.14821223297],
                                "pointD" : [7775.93612044263, 4489.43881233888],
                                "pointE" : [9530, 4959.43881233888],
                                "pointF" : [10000, 3205.37493278151],
                                "pointG" : [10000, 0],
                                "pointM" : [0, 0],
                                "pointT" : [2229.20471066061, 1287.03193977869],
                                "lengthAG" : 9060,
                                "lengthAB" : 1815.94055342345,
                                "lengthBD" : 6410.74986556303,
                                "lengthGF" : 3205.37493278151,
                                "lengthBDE": 8226.69041898647,
                                "lengthGFE": 5021.31548620496,
                                "radius"   : 5892.58120021183,
                                "deltaMEq" : 111.584788582332};

    function sgn(x) {
      return x >= 0 ? 1 : -1;
    }

    function truncate(n) {// truncate towards zero like int() in Perl
      return Math[n > 0 ? "floor" : "ceil"](n);
    }

    function ll2mp(lon, lat) {
      if (isNaN(lon) || isNaN(lat)) {console.log('ll2mp: lon='+ lon + '; lat=' + lat);}
      var south = [0, 6, 7, 8, 5],
          o = truncate(((lon + 200) / 90) + 1),
          p,                                    // parallel
          m = ((lon + 200) - 90 * (o -1)) - 45, // meridian
          s = sgn(m);                           // sign

      m = Math.abs(m);
      if (o === 5)  o = 1;
      if (lat < 0) {
        o = south[o];
      }
      p = Math.abs(lat);
      if (isNaN(m) || isNaN(p) || isNaN(s) || isNaN(o)) {
        console.log('ll2mp:'+ m + ';' + p + ';' + s + ';' + o);
      }
      return [m, p, s, o];
    }

    function distance(p1, p2) {  // distance between two coordinates
      var deltaX = p1[0] - p2[0],
          deltaY = p1[1] - p2[1];
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    function interpolate(l, tl, s, e) {
      var xy = [s[0] + (e[0] - s[0]) * l / tl,
                s[1] + (e[1] - s[1]) * l / tl];
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('interpolate:'+ l + ';' + tl + ';' + s + ';' + e +
                    '; x=' + xy[0] + '; y=' + xy[1]);}
      return xy;
    }

    function equator(m) {
      var l = cahillKeyesConstants.deltaMEq * m,
          joinE = [0, 0];
      if (l <= cahillKeyesConstants.lengthGF) {
        joinE = [cahillKeyesConstants.pointG[0], l];
      } else {
        l = l - cahillKeyesConstants.lengthGF;
        joinE = interpolate(l, cahillKeyesConstants.lengthAB,
                            cahillKeyesConstants.pointF,
                            cahillKeyesConstants.pointE);
      }
      if (isNaN(joinE[0]) || isNaN(joinE[1])) {
        console.log('equator: m=' + m +
                    '; jEx=' + joinE[0] + 'jEy=' + joinE[1]);}
      return joinE;
    }

    function lineIntersection(p1, s1, p2, s2) {  // s1 = slope in degrees
      var m1 = Math.tan(s1 * d3_geo_radians),
          m2 = Math.tan(s2 * d3_geo_radians),
          p = [0, 0];
      p[0] = (m1 * p1[0] - m2 * p2[0] - p1[1] + p2[1]) / (m1 - m2);
      p[1] = m1 * (p[0] - p1[0]) + p1[1];
      if (isNaN(p[0]) || isNaN(p[1])) {
        console.log('lineIntersection,x:'+ p1 + ';' + s1 + ';' + p2 + ';' + s2);
      }
      return p;
    }

    function circleLineIntersection(cc, r, p1, p2) {
      var x1 = p1[0], y1 = p1[1],
          x2 = p2[0], y2 = p2[1],
          xc = cc[0], yc = cc[1],
          a = (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1),
          b = 2 * ( (x2-x1) * (x1-xc) + (y2-y1) * (y1-yc) ),
          c = xc*xc + yc*yc + x1*x1 + y1*y1 - 2 * (xc*x1 + yc*y1) - r*r,
          d = b*b - 4*a*c,
          u1 = 0,
          u2 = 0,
          x = 0,
          y = 0;
      if (a === 0) {
        return [0, [0, 0]];
      } else if (d < 0) {
        return [0, [0, 0]];
      }
      u1 = (-b + Math.sqrt(d) ) / (2*a);
      u2 = (-b - Math.sqrt(d) ) / (2*a);
      if ((0 <= u1) && (u1 <= 1)) {
	     x = x1 + u1 * (x2 - x1);
	     y = y1 + u1 * (y2 - y1);
	     return [1, [x, y]];
      } else if ((0 <= u2) && (u2 <= 1)) {
	     x = x1 + u2 * (x2 - x1);
	     y = y1 + u2 * (y2 - y1);
	     return [1, [x,y]];
      } else {
	     return [0, [0, 0]];
      }
    }

    function jointE(m) {
      return equator(m);
    }

    function jointT(m) {
      return lineIntersection(cahillKeyesConstants.pointM, 2 * m / 3,
                              jointE(m), m / 3);
    }

    function jointF(m) {
      var xy = lineIntersection(cahillKeyesConstants.pointA, m,
                                cahillKeyesConstants.pointM, 2 * m / 3);

      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('jointF: m=' + m +
                    '; x=' + xy[0] + '; y=' + xy[1]);
      }
      return xy;
    }

    function lengthTorridSegment(m) {
      return distance(jointE(m), jointT(m));
    }

    function lengthMiddleSegment(m) {
      return distance(jointT(m), jointF(m));
    }

    function parallel73(m) {
      var p73 = [0, 0],
          jF = jointF(m),
          lF = 0,
          xy = [0, 0];
      if (m <= 30) {
        p73[0] = cahillKeyesConstants.pointA[0] + 1760 * Math.cos(m * d3_geo_radians);
        p73[1] = cahillKeyesConstants.pointA[1] + 1760 * Math.sin(m * d3_geo_radians);
        lF = distance(jF, p73);
      } else {
        p73 = lineIntersection(cahillKeyesConstants.pointT, -60, jF, m);
        lF = distance(jF, p73);
        if (m > 44) {
          xy = lineIntersection(cahillKeyesConstants.pointT, -60, jF, 2/3*m);
          if (xy[0] > p73[0]) {
            p73 = xy;
            lF = - distance(jF, p73);
          }
        }
      }
      return {"parallel73": p73,
              "lengthParallel73": lF};
    }

    function parallel75(m) {
      return [cahillKeyesConstants.pointA[0] + 1560 * Math.cos(m * d3_geo_radians),
              cahillKeyesConstants.pointA[1] + 1560 * Math.sin(m * d3_geo_radians)];
    }

    function zoneA(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneA: m='+ m + '; p=' + p);}
      return [cahillKeyesConstants.pointA[0] + (90 - p) * 104, 0];
    }

    function zoneB(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneB: m='+ m + '; p=' + p);}
      return [cahillKeyesConstants.pointG[0] - p * 100, 0];
    }

    function zoneC(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneC: m='+ m + '; p=' + p);}
      var l = 104 * (90 - p);
      return [cahillKeyesConstants.pointA[0] + l * Math.cos(m * d3_geo_radians),
              cahillKeyesConstants.pointA[1] + l * Math.sin(m * d3_geo_radians)];
    }

    function zoneD(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneD: m='+ m + '; p=' + p);}
      return equator(m);
    }

    function zoneE(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneE: m='+ m + '; p=' + p);}
      var l = 1560 + (75 - p) * 100;
      return [cahillKeyesConstants.pointA[0] + l * Math.cos(m * d3_geo_radians),
              cahillKeyesConstants.pointA[1] + l * Math.sin(m * d3_geo_radians)];

    }

    function zoneF(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneF: m='+ m + '; p=' + p);}
      return interpolate(p, 15,
                         cahillKeyesConstants.pointE,
                         cahillKeyesConstants.pointD);
    }

    function zoneG(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneG: m='+ m + '; p=' + p);}
      var l = p - 15;
      return interpolate(l, 58,
                         cahillKeyesConstants.pointD,
                         cahillKeyesConstants.pointT);
    }

    function zoneH(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneH: m='+ m + '; p=' + p);}
      var p75 = parallel75(45),
          p73a = parallel73(m),
          p73 = p73a.parallel73,
          lF  = distance(cahillKeyesConstants.pointT,
                         cahillKeyesConstants.pointB),
          lF75 = distance(cahillKeyesConstants.pointB, p75),
          l = (75 - p) * (lF75 + lF) / 2,
          xy = [0, 0];
      console.log('zoneH,l:'+ l);
      if (l <= lF75) {
        xy = interpolate(l, lF75,
                         p75, cahillKeyesConstants.pointB);
      } else {
        l = l - lF75;
        xy = interpolate(l, lF,
                         cahillKeyesConstants.pointB, p73);
      }
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('zoneH: m=' + m + '; p=' + p +
                    '; x=' + xy[0] + '; y=' + xy[1]);
      }
      return xy;
    }

    function zoneI(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneI: m='+ m + '; p=' + p);}
      var p73a = parallel73(m),
          lT = lengthTorridSegment(m),
          lM = lengthMiddleSegment(m),
          l = p * (lT + lM + p73a.lengthParallel73) / 73,
          xy;
      if (l <= lT) {
        xy = interpolate(l, lT, jointE(m), jointT(m));
      } else if (l <= (lT + lM)) {
        l = l - lT;
        xy = interpolate(l, lM, jointT(m), jointF(m));
      } else {
        l = l - lT - lM;
        xy = interpolate(l, p73a.lengthParallel73, jointF(m), p73a.parallel73);
      }
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('zoneI: m=' + m + '; p=' + p +
                    '; x=' + xy[0] + '; y=' + xy[1]);
      }
      return xy;
    }

    function zoneJ(m, p) {
      if (isNaN(m) || isNaN(p)) {console.log('zoneJ: m='+ m + '; p=' + p);}
      var p75 = parallel75(m),
		    lF75 = distance(jointF(m), p75),
          p73a= parallel73(m),
          p73 = p73a.parallel73,
          lF  = p73a.lengthParallel73,
		    l = (75 - p) * (lF75 - lF) / 2,
          xy = [0, 0];

      if (l <= lF75) {
	     xy = interpolate(l, lF75, p75, jointF(m));
      } else {
	     l = l - lF75;
	     xy = interpolate(l, -lF, jointF(m), p73);
      }
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('zoneJ: m=' + m + '; p=' + p +
                    '; x=' + xy[0] + '; y=' + xy[1]);
      }
      return xy;
    }

    function zoneK(m, p, l15) {
      if (isNaN(m) || isNaN(p) || isNaN(l15)) {console.log('zoneK: m='+ m + '; p=' + p +
                                                           '; l15=' + l15);}
      var l = p * l15 / 15,
          lT = lengthTorridSegment(m),
          lM = lengthMiddleSegment(m),
          xy = [0, 0];
      if (isNaN(lT) || isNaN(lM)) {
        console.log('zoneK: l15=' + l15 + '; l=' + l + '; lT=' + lT + '; lM=' + lM);
      }
      if (l <= lT) { // point is in torrid segment
	     xy = interpolate (l, lT, jointE(m), jointT(m));
      } else { // point is in middle segment
	     l = l - lT;
	     xy = interpolate (l, lM, jointT(m), jointF(m));
      }
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('zoneK: m=' + m + '; p=' + p + '; l15=' + l15 +
                    '; x=' + xy[0] + '; y=' + xy[1]);
      }
      return xy;
    }

    function zoneL(m, p, l15) {
      if (isNaN(m) || isNaN(p) || isNaN(l15)) {
        console.log('zoneL: m='+ m + '; p=' + p + '; l15=' + l15);
      }
      var p73a = parallel73(m),
          p73 = p73a.parallel73,
          lT = lengthTorridSegment(m),
          lM = lengthMiddleSegment(m),
          xy,
          lF = p73a.lengthParallel73,
          l = l15 + (p - 15) * ((lT + lM + lF) - l15) / 58;
      if (isNaN(lT) || isNaN(lM)) {
        console.log('zoneK: l15=' + l15 + '; l=' + l + '; lT=' + lT + '; lM=' + lM);
      }
      if (l <= lT) { //on torrid segment
        xy = interpolate(l, lT, jointE(m), jointF(m));
      } else if (l <= lT + lM) { //on middle segment
        l = l - lT;
        xy = interpolate(l, lM, jointT(m), jointF(m));
      } else { //on frigid segment
        l = l - lT - lM;
        xy = interpolate(l, lF, jointF(m), p73);
      }
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('zoneL: m=' + m + '; p=' + p + '; l15=' + l15 +
                    '; x=' + xy[0] + '; y=' + xy[1]);
      }
      return xy;
    }

    // # Sub converts half-octant meridian,parallel to x,y coordinates.
    // # Arguments are meridian, parallel, and array output by sub Preliminary not including
    // # its first 3 values.
    function mp2xy(m, p) {
      var xy = [0, 0],
          l,
          p73a,
          p75,
          lF, lF75,
          lT = lengthTorridSegment(m),
          lM = lengthMiddleSegment(m),
          p15a,
          p15,
          flag15,
          l15;

      if (m === 0) { // zones (a) and (b)
        if (p >= 75) {
          xy = zoneA(m, p);
        } else {
          xy = zoneB(m, p);
        }
      } else if (p >= 75) {
        xy = zoneC(m, p);
      } else if (p === 0) {
        xy = zoneD(m, p);
      } else if ((p >= 73) && (m <= 30)) {
        xy = zoneE(m, p);
      } else if (m === 45) {
        if (p <= 15) {
          xy = zoneF(m, p);
        } else if (p <= 73) {
          xy = zoneG(m, p);
        } else {
          xy = zoneH(m, p);
        }
      } else {
        if (m <= 29) {
          xy = zoneI(m, p);
        } else { // supple zones (j), (k) and (l)
          if (p >= 73) {
            xy = zoneJ(m, p);
          } else { //zones (k) and (l)
            p15a = circleLineIntersection(cahillKeyesConstants.pointC,
                                          cahillKeyesConstants.radius,
                                          jointT(m), jointF(m));
            flag15 = p15a[0];
            p15 = p15a[1];
            if (flag15 === 1) { // intersection is in middle segment
              l15 = lT + distance(jointT(m), p15);
            } else { // intersection is in torrid segment
              p15a = circleLineIntersection(cahillKeyesConstants.pointC,
                                            cahillKeyesConstants.radius,
                                            jointE(m), jointT(m));
              flag15 = p15a[0];
              p15 = p15a[1];
              if (flag15 === 0) {
                console.log('Something weird!');
                // TODO: Trap this! Something odd happened!
              }
              l15 = lT - distance(jointT(m), p15);
            }
            if (p <= 15) {
              xy = zoneK(m, p, l15);
            } else { //zone (l)
              xy = zoneL(m, p, l15);
            }
          }
        }
      }
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        console.log('mp2xy: m=' + m + '; p=' + p +
                    '; x=' + xy[0] + '; y=' + xy[1]);
      }
      return xy;
    }

    function rotate(xy, angle) {
      var xynew = [0, 0];
      if (isNaN(xy[0]) || isNaN(xy[1])) {console.log('rotate: xy='+ xy + '; angle=' + angle);}

      if ( angle === 60 ) {
	     xynew[0] =  xy[0] * cahillKeyesConstants.cos60 + xy[1] * cahillKeyesConstants.sin60;
	     xynew[1] = -xy[0] * cahillKeyesConstants.sin60 + xy[1] * cahillKeyesConstants.cos60;
      } else if ( angle === 120 ) {
	     xynew[0] = -xy[0] * cahillKeyesConstants.cos60 + xy[1] * cahillKeyesConstants.sin60;
	     xynew[1] = -xy[0] * cahillKeyesConstants.sin60 - xy[1] * cahillKeyesConstants.cos60;
      } else {
        // !!!!! This should not happen for this projection!!!! TODO: catch it!
	     // print "Sub Rotate expected angle = 60 or 120 but received angle.!\n";
        // the general algorith: cos(angle) * xy + sin(angle) * perpendicular(xy)
        // return cos(angle * d3_geo_radians) * xy + sin(angle * d3_geo_radians) * perpendicular(xy);
        console.log('rotate: angle different than 60 or 120!');
      }

      if (isNaN(xynew[0]) || isNaN(xynew[1])) {
        console.log('rotate: xy=' + xy + '; angle=' + angle + '; xynew=' + xynew);
      }
      return xynew;
    }

    function perpendicular(xy) {
      return [-xy[1], xy[0]];
    }

    function mj2g(xy, octant) {
      if (isNaN(xy[0]) || isNaN(xy[1]) || isNaN(octant)) {
        console.log('mj2g: xy='+ xy + '; o=' + octant);
      }
      var xynew = [0, 0];

      if (octant === 0) {
	     xynew = rotate(xy, 60);
      } else if (octant === 1) {
	     xynew = rotate(xy, 120);
	     xynew[0] -= 10000;
      } else if (octant === 2) {
	     xynew = rotate(xy, 60);
	     xynew[0] -= 10000;
      } else if (octant === 3) {
	     xynew = rotate(xy, 120);
	     xynew[0] += 10000;
      } else if (octant === 4) {
	     xynew = rotate(xy, 60);
	     xynew[0] += 10000;
      } else if (octant === 5) {
	     xynew = rotate([(20000-xy[0]), xy[1]], 60);
	     xynew[0] += 10000;
      } else if (octant === 6) {
	     xynew = rotate([(20000-xy[0]), xy[1]], 120);
	     xynew[0] -= 10000;
      } else if (octant === 7) {
	     xynew = rotate([(20000-xy[0]), xy[1]], 60);
	     xynew[0] -= 10000;
      } else if (octant === 8) {
	     xynew = rotate([(20000-xy[0]), xy[1]], 120);
	     xynew[0] += 10000;
      } else {
	     // TODO trap this some way.
        // ERROR!
        // print "Error converting to M-map coordinates; there is no Octant octant!\n";
        console.log('mj2g: something weird happened!');
	     return (xynew);
      }
      if (isNaN(xynew[0]) || isNaN(xynew[1])) {
        console.log('mj2g before translation: xynew[0]=' + xynew[0] + '; xynew[1]=' + xynew[1]);
      }
      xynew[1] += cahillKeyesConstants.yTranslate;

      if (isNaN(xynew[0]) || isNaN(xynew[1])) {
        console.log('mj2g: xynew[0]=' + xynew[0] + '; xynew[1]=' + xynew[1]);
      }
      return xynew;
    }

    var lon = λ * d3_geo_degrees,
        lat = φ * d3_geo_degrees,
        res = ll2mp(lon, lat),
        m = res[0],
        p = res[1],
        s = res[2],
        o = res[3],
        xy = mp2xy(m, p),
        mm = mj2g([xy[0], s*xy[1]], o);

    if (isNaN(mm[0]) || isNaN(mm[1])) {
      console.log('cahill-keyes: mm[0]='+ mm[0] + '; mm[1]=' + mm[1]);
    }
    return mm;
  }

  var projection = d3.geo.projection;
  d3.geo.cahillKeyes = function() { return d3.geo.projection(cahillKeyes); };
})();
