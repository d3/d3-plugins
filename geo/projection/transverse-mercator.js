import "projection";

function transverseMercator(λ, φ) {
  var B = Math.cos(φ) * Math.sin(λ);
  return [
    .5 * Math.log((1 + B) / (1 - B)),
    Math.atan2(Math.tan(φ), Math.cos(λ))
  ];
}

transverseMercator.invert = function(x, y) {
  return [
    Math.atan2(sinh(x), Math.cos(y)),
    asin(Math.sin(y) / cosh(x))
  ];
};

(d3.geo.transverseMercator = function() { return projection(transverseMercator); }).raw = transverseMercator;
