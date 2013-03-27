import "projection";

function gallStereographic(λ, φ) {
  return [
    λ * Math.SQRT1_2,
    (1 + Math.SQRT1_2) * Math.tan(φ / 2)
  ];
}

gallStereographic.invert = function(x, y) {
  return [
    x * Math.SQRT2,
    Math.atan(y / (1 + Math.SQRT1_2)) * 2
  ];
};

(d3.geo.gallStereographic = function() {
  return projection(gallStereographic);
}).raw = gallStereographic;
