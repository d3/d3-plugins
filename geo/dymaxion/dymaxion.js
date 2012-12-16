(function() {

/************************************************************************/
/* NOTE: in C, array indexing starts with element zero(0).  I choose   */
/*       to start my array indexing with elemennt one(1) so all arrays */
/*       are defined one element longer than they need to be.           */
/************************************************************************/

var SQRT_3  = Math.sqrt(3),
    SQRT_5  = Math.sqrt(5),
    SQRT_8  = Math.sqrt(8),
    SQRT_10 = Math.sqrt(10),
    SQRT_15 = Math.sqrt(15);

var v_x = [],
    v_y = [],
    v_z = [],
    center_x = [],
    center_y = [],
    center_z = [],
    garc, gt, gdve, gel;

/* initializes the global variables which includes the */
/* vertix coordinates and mid-face coordinates.        */

var i, hold_x, hold_y, hold_z, magn;
var λ, φ;

/* Cartesian coordinates for the 12 vertices of icosahedron */

v_x[1] =    0.420152426708710003;
v_y[1] =    0.078145249402782959;
v_z[1] =    0.904082550615019298;
v_x[2] =    0.995009439436241649;
v_y[2] =   -0.091347795276427931;
v_z[2] =    0.040147175877166645;
v_x[3] =    0.518836730327364437;
v_y[3] =    0.835420380378235850;
v_z[3] =    0.181331837557262454;
v_x[4] =   -0.414682225320335218;
v_y[4] =    0.655962405434800777;
v_z[4] =    0.630675807891475371;
v_x[5] =   -0.515455959944041808;
v_y[5] =   -0.381716898287133011;
v_z[5] =    0.767200992517747538;
v_x[6] =    0.355781402532944713;
v_y[6] =   -0.843580002466178147;
v_z[6] =    0.402234226602925571;
v_x[7] =    0.414682225320335218;
v_y[7] =   -0.655962405434800777;
v_z[7] =   -0.630675807891475371;
v_x[8] =    0.515455959944041808;
v_y[8] =    0.381716898287133011;
v_z[8] =   -0.767200992517747538;
v_x[9] =   -0.355781402532944713;
v_y[9] =    0.843580002466178147;
v_z[9] =   -0.402234226602925571;
v_x[10] =  -0.995009439436241649;
v_y[10] =   0.091347795276427931;
v_z[10] =  -0.040147175877166645;
v_x[11] =  -0.518836730327364437;
v_y[11] =  -0.835420380378235850;
v_z[11] =  -0.181331837557262454;
v_x[12] =  -0.420152426708710003;
v_y[12] =  -0.078145249402782959;
v_z[12] =  -0.904082550615019298;

/* now calculate mid face coordinates             */

hold_x = (v_x[1] + v_x[2] + v_x[3]) / 3;
hold_y = (v_y[1] + v_y[2] + v_y[3]) / 3;
hold_z = (v_z[1] + v_z[2] + v_z[3]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[1] = hold_x / magn;
center_y[1] = hold_y / magn;
center_z[1] = hold_z / magn;

hold_x = (v_x[1] + v_x[3] + v_x[4]) / 3;
hold_y = (v_y[1] + v_y[3] + v_y[4]) / 3;
hold_z = (v_z[1] + v_z[3] + v_z[4]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[2] = hold_x / magn;
center_y[2] = hold_y / magn;
center_z[2] = hold_z / magn;

hold_x = (v_x[1] + v_x[4] + v_x[5]) / 3;
hold_y = (v_y[1] + v_y[4] + v_y[5]) / 3;
hold_z = (v_z[1] + v_z[4] + v_z[5]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[3] = hold_x / magn;
center_y[3] = hold_y / magn;
center_z[3] = hold_z / magn;

hold_x = (v_x[1] + v_x[5] + v_x[6]) / 3;
hold_y = (v_y[1] + v_y[5] + v_y[6]) / 3;
hold_z = (v_z[1] + v_z[5] + v_z[6]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[4] = hold_x / magn;
center_y[4] = hold_y / magn;
center_z[4] = hold_z / magn;

hold_x = (v_x[1] + v_x[2] + v_x[6]) / 3;
hold_y = (v_y[1] + v_y[2] + v_y[6]) / 3;
hold_z = (v_z[1] + v_z[2] + v_z[6]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[5] = hold_x / magn;
center_y[5] = hold_y / magn;
center_z[5] = hold_z / magn;

hold_x = (v_x[2] + v_x[3] + v_x[8]) / 3;
hold_y = (v_y[2] + v_y[3] + v_y[8]) / 3;
hold_z = (v_z[2] + v_z[3] + v_z[8]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[6] = hold_x / magn;
center_y[6] = hold_y / magn;
center_z[6] = hold_z / magn;

hold_x = (v_x[8] + v_x[3] + v_x[9]) / 3;
hold_y = (v_y[8] + v_y[3] + v_y[9]) / 3;
hold_z = (v_z[8] + v_z[3] + v_z[9]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[7] = hold_x / magn;
center_y[7] = hold_y / magn;
center_z[7] = hold_z / magn;

hold_x = (v_x[9] + v_x[3] + v_x[4]) / 3;
hold_y = (v_y[9] + v_y[3] + v_y[4]) / 3;
hold_z = (v_z[9] + v_z[3] + v_z[4]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[8] = hold_x / magn;
center_y[8] = hold_y / magn;
center_z[8] = hold_z / magn;

hold_x = (v_x[10] + v_x[9] + v_x[4]) / 3;
hold_y = (v_y[10] + v_y[9] + v_y[4]) / 3;
hold_z = (v_z[10] + v_z[9] + v_z[4]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[9] = hold_x / magn;
center_y[9] = hold_y / magn;
center_z[9] = hold_z / magn;

hold_x = (v_x[5] + v_x[10] + v_x[4]) / 3;
hold_y = (v_y[5] + v_y[10] + v_y[4]) / 3;
hold_z = (v_z[5] + v_z[10] + v_z[4]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[10] = hold_x / magn;
center_y[10] = hold_y / magn;
center_z[10] = hold_z / magn;

hold_x = (v_x[5] + v_x[11] + v_x[10]) / 3;
hold_y = (v_y[5] + v_y[11] + v_y[10]) / 3;
hold_z = (v_z[5] + v_z[11] + v_z[10]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[11] = hold_x / magn;
center_y[11] = hold_y / magn;
center_z[11] = hold_z / magn;

hold_x = (v_x[5] + v_x[6] + v_x[11]) / 3;
hold_y = (v_y[5] + v_y[6] + v_y[11]) / 3;
hold_z = (v_z[5] + v_z[6] + v_z[11]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[12] = hold_x / magn;
center_y[12] = hold_y / magn;
center_z[12] = hold_z / magn;

hold_x = (v_x[11] + v_x[6] + v_x[7]) / 3;
hold_y = (v_y[11] + v_y[6] + v_y[7]) / 3;
hold_z = (v_z[11] + v_z[6] + v_z[7]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[13] = hold_x / magn;
center_y[13] = hold_y / magn;
center_z[13] = hold_z / magn;

hold_x = (v_x[7] + v_x[6] + v_x[2]) / 3;
hold_y = (v_y[7] + v_y[6] + v_y[2]) / 3;
hold_z = (v_z[7] + v_z[6] + v_z[2]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[14] = hold_x / magn;
center_y[14] = hold_y / magn;
center_z[14] = hold_z / magn;

hold_x = (v_x[8] + v_x[7] + v_x[2]) / 3;
hold_y = (v_y[8] + v_y[7] + v_y[2]) / 3;
hold_z = (v_z[8] + v_z[7] + v_z[2]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[15] = hold_x / magn;
center_y[15] = hold_y / magn;
center_z[15] = hold_z / magn;

hold_x = (v_x[12] + v_x[9] + v_x[8]) / 3;
hold_y = (v_y[12] + v_y[9] + v_y[8]) / 3;
hold_z = (v_z[12] + v_z[9] + v_z[8]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[16] = hold_x / magn;
center_y[16] = hold_y / magn;
center_z[16] = hold_z / magn;

hold_x = (v_x[12] + v_x[9] + v_x[10]) / 3;
hold_y = (v_y[12] + v_y[9] + v_y[10]) / 3;
hold_z = (v_z[12] + v_z[9] + v_z[10]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[17] = hold_x / magn;
center_y[17] = hold_y / magn;
center_z[17] = hold_z / magn;

hold_x = (v_x[12] + v_x[11] + v_x[10]) / 3;
hold_y = (v_y[12] + v_y[11] + v_y[10]) / 3;
hold_z = (v_z[12] + v_z[11] + v_z[10]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[18] = hold_x / magn;
center_y[18] = hold_y / magn;
center_z[18] = hold_z / magn;

hold_x = (v_x[12] + v_x[11] + v_x[7]) / 3;
hold_y = (v_y[12] + v_y[11] + v_y[7]) / 3;
hold_z = (v_z[12] + v_z[11] + v_z[7]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[19] = hold_x / magn;
center_y[19] = hold_y / magn;
center_z[19] = hold_z / magn;

hold_x = (v_x[12] + v_x[8] + v_x[7]) / 3;
hold_y = (v_y[12] + v_y[8] + v_y[7]) / 3;
hold_z = (v_z[12] + v_z[8] + v_z[7]) / 3;
magn = Math.sqrt(hold_x * hold_x + hold_y * hold_y + hold_z * hold_z);
center_x[20] = hold_x / magn;
center_y[20] = hold_y / magn;
center_z[20] = hold_z / magn;

garc = 2 * Math.asin(Math.sqrt(5 - SQRT_5) / SQRT_10);
gt = garc / 2;

gdve = Math.sqrt(3 + SQRT_5) / Math.sqrt(5 + SQRT_5);
gel = SQRT_8 / Math.sqrt(5 + SQRT_5);

function dymaxion(λ, φ) {
  /* convert spherical to cartesian   */
  var h = s_to_c(λ, φ);

  /* determine which of the 20 spherical icosahedron triangles */
  /* the given point is in and the LCD triangle.               */
  var info = s_tri_info(h.x, h.y, h.z);

  /* Determine the corresponding Fuller map plane(x, y) point */
  return dymax_point(info.tri, info.lcd, h.x, h.y, h.z);
}

/* Covert spherical polar coordinates to cartesian coordinates. */
/* The angles are given in radians.                             */
function s_to_c(λ, φ) {
  var cosφ = Math.cos(φ);
  return {
    x: cosφ * Math.cos(λ),
    y: cosφ * Math.sin(λ),
    z: Math.sin(φ)
  };
}

/* convert cartesian coordinates into spherical polar coordinates. */
/* The angles are given in radians.                                */
function c_to_s(x, y, z) {
  return {
    lat: Math.acos(z),
    lng: Math.atan2(y, x)
  };
}

/* Determine which triangle and LCD triangle the point is in. */
function s_tri_info(x, y, z) {
  var d1 = Infinity, d2, d3,
      v1, v2, v3,
      dx, dy, dz,
      tri = 0, lcd;

  /* Which triangle face center is the closest to the given point */
  /* is the triangle in which the given point is in.              */
  for (var i = 1; i <= 20; ++i) {
     if ((d2 = (dx = center_x[i] - x) * dx + (dy = center_y[i] - y) * dy + (dz = center_z[i] - z) * dz) < d1) {
       tri = i;
       d1 = d2;
     }
   }

  /* Now the LCD triangle is determined. */
  switch (tri) {
    case 1:  v1 =  1; v2 =  3; v3 =  2; break;
    case 2:  v1 =  1; v2 =  4; v3 =  3; break;
    case 3:  v1 =  1; v2 =  5; v3 =  4; break;
    case 4:  v1 =  1; v2 =  6; v3 =  5; break;
    case 5:  v1 =  1; v2 =  2; v3 =  6; break;
    case 6:  v1 =  2; v2 =  3; v3 =  8; break;
    case 7:  v1 =  3; v2 =  9; v3 =  8; break;
    case 8:  v1 =  3; v2 =  4; v3 =  9; break;
    case 9:  v1 =  4; v2 = 10; v3 =  9; break;
    case 10: v1 =  4; v2 =  5; v3 = 10; break;
    case 11: v1 =  5; v2 = 11; v3 = 10; break;
    case 12: v1 =  5; v2 =  6; v3 = 11; break;
    case 13: v1 =  6; v2 =  7; v3 = 11; break;
    case 14: v1 =  2; v2 =  7; v3 =  6; break;
    case 15: v1 =  2; v2 =  8; v3 =  7; break;
    case 16: v1 =  8; v2 =  9; v3 = 12; break;
    case 17: v1 =  9; v2 = 10; v3 = 12; break;
    case 18: v1 = 10; v2 = 11; v3 = 12; break;
    case 19: v1 = 11; v2 =  7; v3 = 12; break;
    case 20: v1 =  8; v2 = 12; v3 =  7; break;
  }

  d1 = (dx = x - v_x[v1]) * dx + (dy = y - v_y[v1]) * dy + (dz = z - v_z[v1]) * dz;
  d2 = (dx = x - v_x[v2]) * dx + (dy = y - v_y[v2]) * dy + (dz = z - v_z[v2]) * dz;
  d3 = (dx = x - v_x[v3]) * dx + (dy = y - v_y[v3]) * dy + (dz = z - v_z[v3]) * dz;

  if ((d1 <= d2) && (d2 <= d3)) lcd = 1;
  else if ((d1 <= d3) && (d3 <= d2)) lcd = 6;
  else if ((d2 <= d1) && (d1 <= d3)) lcd = 2;
  else if ((d2 <= d3) && (d3 <= d1)) lcd = 3;
  else if ((d3 <= d1) && (d1 <= d2)) lcd = 5;
  else /* if ((d3 <= d2) && (d2 <= d1)) */ lcd = 4;

  return {
    tri: tri,
    lcd: lcd
  };
}

function dymax_point(tri, lcd, x, y, z) {
  var v1;  // int
  var h;

  var gs; // double
  var gx, gy, gz, ga1,ga2,ga3,ga1p,ga2p,ga3p,gxp,gyp,gzp; // double

  /* In order to rotate the given point into the template spherical */
  /* triangle, we need the spherical polar coordinates of the center */
  /* of the face and one of the face vertices. So set up which vertex */
  /* to use.                                                          */

  switch (tri) {
    case 1:  v1 =  1;  break;
    case 2:  v1 =  1;  break;
    case 3:  v1 =  1;  break;
    case 4:  v1 =  1;  break;
    case 5:  v1 =  1;  break;
    case 6:  v1 =  2;  break;
    case 7:  v1 =  3;  break;
    case 8:  v1 =  3;  break;
    case 9:  v1 =  4;  break;
    case 10: v1 =  4;  break;
    case 11: v1 =  5;  break;
    case 12: v1 =  5;  break;
    case 13: v1 =  6;  break;
    case 14: v1 =  2;  break;
    case 15: v1 =  2;  break;
    case 16: v1 =  8;  break;
    case 17: v1 =  9;  break;
    case 18: v1 = 10;  break;
    case 19: v1 = 11;  break;
    case 20: v1 =  8;  break;
  }

  var h0 = {x: x, y: y, z: z},
      h1 = {x: v_x[v1], y: v_y[v1], z: v_z[v1]};

  h = c_to_s(center_x[tri], center_y[tri], center_z[tri]);

  rotateZ(h.lng, h0);
  rotateZ(h.lng, h1);
  rotateY(h.lat, h0);
  rotateY(h.lat, h1);

  h = c_to_s(h1.x, h1.y, h1.z);
  h.lng = h.lng - Math.PI / 2;

  rotateZ(h.lng, h0);

  /* exact transformation equations */

  gz = Math.sqrt(1 - h0.x * h0.x - h0.y * h0.y);
  gs = Math.sqrt(5 + 2 * SQRT_5) / (gz * SQRT_15);

  gxp = h0.x * gs;
  gyp = h0.y * gs;

  ga1p = 2 * gyp / SQRT_3 + (gel / 3);
  ga2p = gxp - (gyp / SQRT_3) +  (gel / 3);
  ga3p = (gel / 3) - gxp - (gyp / SQRT_3);

  ga1 = gt + Math.atan2((ga1p - .5 * gel), gdve);
  ga2 = gt + Math.atan2((ga2p - .5 * gel), gdve);
  ga3 = gt + Math.atan2((ga3p - .5 * gel), gdve);

  gx = .5 * (ga2 - ga3);
  gy = 1 / (2 * SQRT_3) * (2 * ga1 - ga2 - ga3);

  /* Re-scale so plane triangle edge length is 1. */
  var pt = {x: gx / garc, y: gy / garc};

  /* rotate and translate to correct position */
  var point2d = {};

  switch (tri) {
    case  1: rotateZ(-4 / 3 * Math.PI, pt); point2d.x = pt.x + 2; point2d.y = pt.y + 7 / (2 * SQRT_3); break;
    case  2: rotateZ(-5 / 3 * Math.PI, pt); point2d.x = pt.x + 2; point2d.y = pt.y + 5 / (2 * SQRT_3); break;
    case  3: point2d.x = pt.x + 2.5; point2d.y = pt.y + 2 / SQRT_3; break;
    case  4: rotateZ(-1 / 3 * Math.PI, pt); point2d.x = pt.x + 3; point2d.y = pt.y + 5 / (2 * SQRT_3); break;
    case  5: rotateZ(-Math.PI, pt); point2d.x = pt.x + 2.5; point2d.y = pt.y + 4 * SQRT_3 / 3; break;
    case  6: rotateZ(-5 / 3 * Math.PI, pt); point2d.x = pt.x + 1.5; point2d.y = pt.y + 4 * SQRT_3 / 3; break;
    case  7: rotateZ(-5 / 3 * Math.PI, pt); point2d.x = pt.x + 1; point2d.y = pt.y + 5 / (2 * SQRT_3); break;
    case  8: point2d.x = pt.x + 1.5; point2d.y = pt.y + 2 / SQRT_3; break;
    case  9: if (lcd > 2) { rotateZ(-5 / 3 * Math.PI, pt); point2d.x = pt.x + 1.5; point2d.y = pt.y + 1 / SQRT_3; }
             else { point2d.x = pt.x + 2; point2d.y = pt.y + 1 / (2 * SQRT_3); } break;
    case 10: rotateZ(-1 / 3 * Math.PI, pt); point2d.x = pt.x + 2.5; point2d.y = pt.y + 1 / SQRT_3; break;
    case 11: rotateZ(-1 / 3 * Math.PI, pt); point2d.x = pt.x + 3.5; point2d.y = pt.y + 1 / SQRT_3; break;
    case 12: rotateZ(-2 / 3 * Math.PI, pt); point2d.x = pt.x + 3.5; point2d.y = pt.y + 2 / SQRT_3; break;
    case 13: rotateZ(-1 / 3 * Math.PI, pt); point2d.x = pt.x + 4; point2d.y = pt.y + 5 / (2 * SQRT_3); break;
    case 14: point2d.x = pt.x + 4; point2d.y = pt.y + 7 / (2 * SQRT_3); break;
    case 15: point2d.x = pt.x + 5; point2d.y = pt.y + 7 / (2 * SQRT_3); break;
    case 16: if (lcd < 4) { rotateZ(-1 / 3 * Math.PI, pt); point2d.x = pt.x + 0.5; point2d.y = pt.y + 1 / SQRT_3; }
             else { point2d.x = pt.x + 5.5; point2d.y = pt.y + 2 / SQRT_3; } break;
    case 17: point2d.x = pt.x + 1; point2d.y = pt.y + 1 / (2 * SQRT_3); break;
    case 18: rotateZ(-2 / 3 * Math.PI, pt); point2d.x = pt.x + 4; point2d.y = pt.y + 1 / (2 * SQRT_3); break;
    case 19: rotateZ(-2 / 3 * Math.PI, pt); point2d.x = pt.x + 4.5; point2d.y = pt.y + 2 / SQRT_3; break;
    case 20: rotateZ(-5 / 3 * Math.PI, pt); point2d.x = pt.x + 5; point2d.y = pt.y + 5 / (2 * SQRT_3); break;
  }

  return [point2d.x, point2d.y];
}

function rotateY(θ, point) {
  var cosθ = Math.cos(θ), sinθ = Math.sin(θ), x = point.x, z = point.z;
  point.x = x * cosθ - z * sinθ;
  point.z = x * sinθ + z * cosθ;
}

function rotateZ(θ, point) {
  var cosθ = Math.cos(θ), sinθ = Math.sin(θ), x = point.x, y = point.y;
  point.x = x * cosθ + y * sinθ;
  point.y = y * cosθ - x * sinθ;
}

d3.geo.dymaxion = function() {
  return d3.geo.projection(dymaxion);
};

})();
