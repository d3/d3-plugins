// all names of reference points, A, B, D, ... , G, P75
// or zones, A-L, are detailed fully in Gene Keyes'
// web site http://www.genekeyes.com/CKOG-OOo/7-CKOG-illus-&-coastline.html
(function() {
  var π = Math.PI,
      sqrtπ = Math.sqrt(π),
      d3_geo_degrees = 180 / Math.PI,
      d3_geo_radians = Math.PI / 180,
      CK = { "lengthMG" : 10000 // magic scaling length
           };

  preliminaries();

  function preliminaries() {
    var pointN, lengthMB, lengthMN, lengthNG, pointU;
    var m = 29, // meridian
        p = 15, // parallel
        p73a, lF, lT, lM, l, pointV,
        k = Math.sqrt(3);

    CK.lengthMA = 940 / 10000 * CK.lengthMG; //*
    CK.lengthParallel0to73At0  = CK.lengthMG / 100; //*
    CK.lengthParallel73to90At0 = ((CK.lengthMG - CK.lengthMA) -
                                  (CK.lengthParallel0to73At0 * 73)) / (90 - 73); //*
    CK.sin60 = 0.866025403784439; // √3/2  //*
    CK.cos60 = 0.5; //*
    CK.yTranslate = CK.lengthMG * CK.sin60; //*
    CK.pointM = [0, 0]; //*
    CK.pointG = [CK.lengthMG, 0]; //*
    pointN    = [CK.lengthMG, CK.lengthMG * Math.tan(30 * d3_geo_radians)];
    CK.pointA = [CK.lengthMA, 0]; //*
    CK.pointB = lineIntersection (CK.pointM, 30, CK.pointA, 45); //*
    CK.lengthAG = distance(CK.pointA, CK.pointG);//*
    CK.lengthAB = distance(CK.pointA, CK.pointB);//*
    lengthMB = distance(CK.pointM, CK.pointB);
    lengthMN = distance(CK.pointM, pointN);
    lengthNG = distance(pointN, CK.pointG);
    CK.pointD =  interpolate(lengthMB, lengthMN, pointN, CK.pointM); //*
    CK.pointF = [CK.lengthMG, lengthNG - lengthMB]; //*
    CK.pointE = [pointN[0] - CK.lengthMA * Math.sin(30 * d3_geo_radians),
                 pointN[1] - CK.lengthMA * Math.cos(30 * d3_geo_radians)]; //*
    CK.lengthGF = distance(CK.pointG, CK.pointF);//*
    CK.lengthBD = distance(CK.pointB, CK.pointD);//*
    CK.lengthBDE = CK.lengthBD + CK.lengthAB; // lengthAB = lengthDE  //*
    CK.lengthGFE = CK.lengthGF + CK.lengthAB; // lengthAB = lengthFE  //*
    CK.deltaMEq = CK.lengthGFE / 45; //*
    CK.lengthAP75 = (90 - 75) * CK.lengthParallel73to90At0; //*
    CK.lengthAP73 = CK.lengthMG - CK.lengthMA - CK.lengthParallel0to73At0 * 73; //*
    pointU = [CK.pointA[0] + CK.lengthAP73 * Math.cos(30 * d3_geo_radians),
              CK.pointA[1] + CK.lengthAP73 * Math.sin(30 * d3_geo_radians)];
    CK.pointT = lineIntersection(pointU, -60, CK.pointB, 30);//*

    p73a = parallel73(m);
    lF  = p73a.lengthParallel73;
    lT = lengthTorridSegment(m);
    lM = lengthMiddleSegment(m);
    l = p * (lT + lM + lF) / 73;
    pointV = [0, 0];
    CK.pointC = [0, 0];
    CK.radius = 0;

    l = l - lT;
    pointV = interpolate(l, lM, jointT(m), jointF(m));
    CK.pointC[1] = (pointV[0] * pointV[0] + pointV[1] * pointV[1] -
                    CK.pointD[0] * CK.pointD[0] - CK.pointD[1] * CK.pointD[1]) /
                    (2 * (k * pointV[0] + pointV[1] - k * CK.pointD[0] - CK.pointD[1]));
    CK.pointC[0] = k * CK.pointC[1];
    CK.radius = distance(CK.pointC, CK.pointD);

    return CK;
  }


  /////// helper functions ///////

  // distance between two 2D coordinates
  function distance(p1, p2) {
    var deltaX = p1[0] - p2[0],
        deltaY = p1[1] - p2[1];
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  // return 2D point at position length/totallength of the line
  // defined by two 2D points, start and end.
  function interpolate(length, totalLength, start, end) {
    assert(start).not().equals(end);
    var xy = [start[0] + (end[0] - start[0]) * length / totalLength,
              start[1] + (end[1] - start[1]) * length / totalLength];
    if (isNaN(xy[0]) || isNaN(xy[1])) {
      console.log('interpolate:'+ length + ';' + totalLength + ';' +
                  start + ';' + end + '; x=' + xy[0] + '; y=' + xy[1]);}
    return xy;
  }

  // return the 2D point intersection between two lines defined
  // by one 2D point and a slope each.
  function lineIntersection(point1, slope1, point2, slope2) {
    // s1/s2 = slope in degrees
    assert(point1).not().equals(point2);
    assert(slope1).not().equals(slope2);
    var m1 = Math.tan(slope1 * d3_geo_radians),
        m2 = Math.tan(slope2 * d3_geo_radians),
        p = [0, 0];
    p[0] = (m1 * point1[0] - m2 * point2[0] - point1[1] + point2[1]) / (m1 - m2);
    p[1] = m1 * (p[0] - point1[0]) + point1[1];
    if (isNaN(p[0]) || isNaN(p[1])) {
      console.log('lineIntersection,IN:'+ point1 + ';' + slope1 + ';' +
                  point2 + ';' + slope2);
      console.log('lineIntersection,OUT:'+ p);
    }
    return p;
  }

  // return the 2D point intercepting a circumference centered
  // at cc and of radius rn and a line defined by 2 points, p1 and p2:
  // First element of the returned array is a flag to state whether there is
  // an intersection, a value of zero (0) means NO INTERSECTION.
  // The following array is the 2D point of the intersection.
  // Equations from "Intersection of a Line and a Sphere (or circle)/Line Segment"
  // at http://paulbourke.net/geometry/circlesphere/
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

  // counterclockwise rotate 2D vector, xy, by angle (in degrees)
  // [original CKOG uses clockwise rotation]
  function rotate(xy, angle) {
    var xynew = [0, 0];
    if (isNaN(xy[0]) || isNaN(xy[1])) {console.log('rotate: xy='+ xy + '; angle=' + angle);}

    if ( angle === -60 ) {
	   xynew[0] =  xy[0] * CK.cos60 + xy[1] * CK.sin60;
	   xynew[1] = -xy[0] * CK.sin60 + xy[1] * CK.cos60;
    } else if ( angle === -120 ) {
	   xynew[0] = -xy[0] * CK.cos60 + xy[1] * CK.sin60;
	   xynew[1] = -xy[0] * CK.sin60 - xy[1] * CK.cos60;
    } else {
      // !!!!! This should not happen for this projection!!!!
      // the general algorith: cos(angle) * xy + sin(angle) * perpendicular(xy)
      // return cos(angle * d3_geo_radians) * xy + sin(angle * d3_geo_radians) * perpendicular(xy);
      console.log('rotate: angle ' + angle + ' different than -60 or -120!');
      // counterclockwise
      xynew[0] = xy[0] * Math.cos(angle * d3_geo_radians) - xy[1] * Math.sin(angle * d3_geo_radians);
	   xynew[1] = xy[0] * Math.sin(angle * d3_geo_radians) + xy[1] * Math.cos(angle * d3_geo_radians);

    }

    if (isNaN(xynew[0]) || isNaN(xynew[1])) {
      console.log('rotate: xy=' + xy + '; angle=' + angle + '; xynew=' + xynew);
    }
    return xynew;
  }

  function perpendicular(xy) {
    return [-xy[1], xy[0]];
  }

  function sgn(x) {
    return x >= 0 ? 1 : -1;
  }

  // truncate towards zero like int() in Perl
  function truncate(n) {
    return Math[n > 0 ? "floor" : "ceil"](n);
  }

  function equator(m) {
    var l = CK.deltaMEq * m,
        jointE = [0, 0];
    if (l <= CK.lengthGF) {
      jointE = [CK.pointG[0], l];
    } else {
      l = l - CK.lengthGF;
      jointE = interpolate(l, CK.lengthAB,
                           CK.pointF,
                           CK.pointE);
    }
    if (isNaN(jointE[0]) || isNaN(jointE[1])) {
      console.log('equator: m=' + m +
                  '; jEx=' + jointE[0] + 'jEy=' + jointE[1]);}
    return jointE;
  }

  function jointE(m) {
    return equator(m);
  }

  function jointT(m) {
    if (m === 0) { console.log('jointT: m=' + m + '!'); }
    return lineIntersection(CK.pointM, 2 * m / 3,
                            jointE(m), m / 3);
  }

  function jointF(m) {
    if (m === 0) {
      return [CK.pointA + CK.lengthAB, 0];
    }
    var xy = lineIntersection(CK.pointA, m,
                              CK.pointM, 2 * m / 3);

    if (isNaN(xy[0]) || isNaN(xy[1])) {
      console.log('jointF: m=' + m +
                  '; x=' + xy[0] + '; y=' + xy[1]);
    }
    return xy;
  }

  function lengthTorridSegment(m) {
    if (m === 0) { console.log('lengthTorridSegment: m=' + m + '!'); }
    return distance(jointE(m), jointT(m));
  }

  function lengthMiddleSegment(m) {
    if (m === 0) { console.log('lengthMiddleSegment: m=' + m + '!'); }
    return distance(jointT(m), jointF(m));
  }

  function parallel73(m) {
    var p73 = [0, 0],
        jF = jointF(m),
        lF = 0,
        xy = [0, 0];
    if (m <= 30) {
      p73[0] = CK.pointA[0] +
        CK.lengthAP73 * Math.cos(m * d3_geo_radians);
      p73[1] = CK.pointA[1] +
        CK.lengthAP73 * Math.sin(m * d3_geo_radians);
      lF = distance(jF, p73);
    } else {
      p73 = lineIntersection(CK.pointT, -60, jF, m);
      lF = distance(jF, p73);
      if (m > 44) {
        xy = lineIntersection(CK.pointT, -60, jF, 2 / 3 * m);
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
    return [CK.pointA[0] +
            CK.lengthAP75 * Math.cos(m * d3_geo_radians),
            CK.pointA[1] +
            CK.lengthAP75 * Math.sin(m * d3_geo_radians)];
  }

  // special functions to transform lon/lat to x/y
  function ll2mp(lon, lat) {
    if (isNaN(lon) || isNaN(lat)) {console.log('ll2mp: lon='+ lon + '; lat=' + lat);}
    var south = [0, 6, 7, 8, 5],
        o = truncate(((lon + 180) / 90) + 1),
        p,                                     // parallel
        m = ((lon + 180) - 90 * (o - 1)) - 45, // meridian
        s = sgn(m);                            // sign

    m = Math.abs(m);
    if (o === 5) o = 1;
    if (lat < 0) o = south[o];
    p = Math.abs(lat);
    if (isNaN(m) || isNaN(p) || isNaN(s) || isNaN(o)) {
      console.log('ll2mp:'+ m + ';' + p + ';' + s + ';' + o);
    }
    return [m, p, s, o];
  }

  function zoneA(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneA: m='+ m + '; p=' + p);}
    return [CK.pointA[0] + (90 - p) * 104, 0];
  }

  function zoneB(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneB: m='+ m + '; p=' + p);}
    return [CK.pointG[0] - p * 100, 0];
  }

  function zoneC(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneC: m='+ m + '; p=' + p);}
    var l = 104 * (90 - p);
    return [CK.pointA[0] + l * Math.cos(m * d3_geo_radians),
            CK.pointA[1] + l * Math.sin(m * d3_geo_radians)];
  }

  function zoneD(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneD: m='+ m + '; p=' + p);}
    return equator(m);
  }

  function zoneE(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneE: m='+ m + '; p=' + p);}
    var l = 1560 + (75 - p) * 100;
    return [CK.pointA[0] + l * Math.cos(m * d3_geo_radians),
            CK.pointA[1] + l * Math.sin(m * d3_geo_radians)];
  }

  function zoneF(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneF: m='+ m + '; p=' + p);}
    return interpolate(p, 15,
                       CK.pointE,
                       CK.pointD);
  }

  function zoneG(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneG: m='+ m + '; p=' + p);}
    var l = p - 15;
    return interpolate(l, 58, CK.pointD, CK.pointT);
  }

  function zoneH(m, p) {
    if (isNaN(m) || isNaN(p)) {console.log('zoneH: m='+ m + '; p=' + p);}
    var p75 = parallel75(45),
        p73a = parallel73(m),
        p73 = p73a.parallel73,
        lF  = distance(CK.pointT, CK.pointB),
        lF75 = distance(CK.pointB, p75),
        l = (75 - p) * (lF75 + lF) / 2,
        xy = [0, 0];
    // console.log('zoneH,l:'+ l);
    if (l <= lF75) {
      xy = interpolate(l, lF75, p75, CK.pointB);
    } else {
      l = l - lF75;
      xy = interpolate(l, lF, CK.pointB, p73);
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
    if (m === 0) { console.log('zoneI: m=' + m + '!'); }
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
    if (m === 0) { console.log('zoneK: m=' + m + '!'); }
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
    if (m === 0) { console.log('zoneL: m=' + m + '!'); }
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

  // convert half-octant meridian,parallel to x,y coordinates.
  // arguments are meridian, parallel
  function mp2xy(m, p) {
    var xy = [0, 0],
        l,
        p73a,
        p75,
        lF, lF75,
        lT,
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
          p15a = circleLineIntersection(CK.pointC,
                                        CK.radius,
                                        jointT(m), jointF(m));
          flag15 = p15a[0];
          p15 = p15a[1];
          lT = lengthTorridSegment(m);
          if (flag15 === 1) { // intersection is in middle segment
            l15 = lT + distance(jointT(m), p15);
          } else { // intersection is in torrid segment
            p15a = circleLineIntersection(CK.pointC,
                                          CK.radius,
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

  // from half-octant to megamap (single rotated octant)
  function mj2g(xy, octant) {
    if (isNaN(xy[0]) || isNaN(xy[1]) || isNaN(octant)) {
      console.log('mj2g: xy='+ xy + '; o=' + octant);
    }
    var xynew = [0, 0];

    if (octant === 0) {
	   xynew = rotate(xy, -60);
    } else if (octant === 1) {
	   xynew = rotate(xy, -120);
	   xynew[0] -= CK.lengthMG;
    } else if (octant === 2) {
	   xynew = rotate(xy, -60);
	   xynew[0] -= CK.lengthMG;
    } else if (octant === 3) {
	   xynew = rotate(xy, -120);
	   xynew[0] += CK.lengthMG;
    } else if (octant === 4) {
	   xynew = rotate(xy, -60);
	   xynew[0] += CK.lengthMG;
    } else if (octant === 5) {
	   xynew = rotate([(2*CK.lengthMG-xy[0]), xy[1]], -60);
	   xynew[0] += CK.lengthMG;
    } else if (octant === 6) {
	   xynew = rotate([(2*CK.lengthMG-xy[0]), xy[1]], -120);
	   xynew[0] -= CK.lengthMG;
    } else if (octant === 7) {
	   xynew = rotate([(2*CK.lengthMG-xy[0]), xy[1]], -60);
	   xynew[0] -= CK.lengthMG;
    } else if (octant === 8) {
	   xynew = rotate([(2*CK.lengthMG-xy[0]), xy[1]], -120);
	   xynew[0] += CK.lengthMG;
    } else {
	   // TODO trap this some way.
      // ERROR!
      // print "Error converting to M-map coordinates; there is no Octant octant!\n";
      console.log('mj2g: something weird happened!');
	   return xynew;
    }
    if (isNaN(xynew[0]) || isNaN(xynew[1])) {
      console.log('mj2g before translation: xynew[0]=' + xynew[0] + '; xynew[1]=' + xynew[1]);
    }
    xynew[1] += CK.yTranslate;

    if (isNaN(xynew[0]) || isNaN(xynew[1])) {
      console.log('mj2g: xynew[0]=' + xynew[0] + '; xynew[1]=' + xynew[1]);
    }
    return xynew;
  }

  // coordinate transformation FOR 1 octant, rotated -90 degrees,
  // normalised on largest half-octant side, traslated
  // up on y axis.
  // v = tan(30º) - 940/10000 * cos*(30º)
  //  -v < x < v; 0 <= y < 1 - 940/10000.
  function cahillKeyesOneOctant(λ, φ) {
    // λ, φ are in radians.
//    console.log("λ = " + λ + "; φ = " + φ + ".");
//    assert(λ).lessThanOrEqual(π/4);
//    var lon = (λ > π/4 ? π/4 : λ) * d3_geo_degrees,
    var lon = λ * d3_geo_degrees,
        lat = φ * d3_geo_degrees,
        res = ll2mp(lon, lat),
        m = res[0],
        p = res[1],
        s = res[2],
        o = res[3],
        xy = mp2xy(m, p),
        mm = [s*xy[1] / CK.lengthMG,
               -xy[0] / CK.lengthMG]; //rotated, ~normalized ...
    mm[1] += 1;                       //...and translated

    if (isNaN(mm[0]) || isNaN(mm[1])) {
      console.log('cahill-keyes: mm[0]='+ mm[0] + '; mm[1]=' + mm[1]);
    }
    return mm;
  }

  // general CK map projection
  function cahillKeyes(λ, φ) {
    // λ, φ are in radians.
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


  // d3.geo.polyhedron.cahillkeyes = function(faceProjection) {

  //   // projection for the reference face: centered at G, M up
  //   faceProjection = faceProjection || function(face) {
  //     var centroid = face.length === 6 ? d3.geo.centroid({type: "MultiPoint", coordinates: face}) : face[0];
  //     return d3.geo.gnomonic().scale(1).translate([0, 0]).rotate([-centroid[0], -centroid[1]]);
  //   };

  //   var faces = d3.geo.polyhedron.octahedron.map(function(face) {
  //     return {face: face, project: faceProjection(face)};
  //   });

  //   [-1, 0, 0, 1, 0, 1, 4, 5].forEach(function(d, i) {
  //     var node = faces[d];
  //     node && (node.children || (node.children = [])).push(faces[i]);
  //   });

  //   return d3.geo.polyhedron(faces[0], function (λ, φ) {
  //     // mape lon/lat to relevant octant
  //     var lon = λ * d3_geo_degrees,
  //         south = [0, 6, 7, 8, 5],
  //         o = truncate(((lon + 180) / 90) + 1);
  //     if (o === 5)  o = 1;
  //     if (φ < 0)    o = south[o];
  //     return faces[o];
  //   });
  // };

  var projection = d3.geo.projection;
  (d3.geo.cahillKeyes = function() { return d3.geo.projection(cahillKeyes); }).raw = cahillKeyes;
//  (d3.geo.cahillKeyes1o = function() { return d3.geo.projection(cahillKeyesOneOctant); }).raw = cahillKeyesOneOctant;

})();
