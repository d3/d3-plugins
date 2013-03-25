import "projection";

function gallStereographic(λ, φ) {
  return [
    λ / Math.SQRT2,
    (1 + Math.SQRT2 / 2) * Math.tan(φ / 2)
  ];
}

gallStereographic.invert = function(x, y) {
  return [
    x * Math.SQRT2,
    Math.atan(y / (1 + Math.SQRT2 / 2)) * 2
  ];
};

(d3.geo.gallStereographic = function() {
  return projection(gallStereographic);
}).raw = gallStereographic;
