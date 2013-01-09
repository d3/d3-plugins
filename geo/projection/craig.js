// @import parallel1

function craig(φ0) {
  var tanφ0 = Math.tan(φ0);

  function forward(λ, φ) {
    return [
      λ,
      (λ ? λ / Math.sin(λ) : 1) * (Math.sin(φ) * Math.cos(λ) - tanφ0 * Math.cos(φ))
    ];
  }

  // TODO
  // forward.invert = function(x, y) {
  //   return [
  //     x,
  //     asin(y * (x ? Math.tan(x) / x : 1))
  //   ];
  // };

  return forward;
}

(d3.geo.craig = function() { return parallel1Projection(craig); }).raw = craig;
