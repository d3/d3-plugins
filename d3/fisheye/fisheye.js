d3.fisheye = function() {
  var fisheye = {},
      radius = 200,
      power = 2,
      k0,
      k1,
      center = [0, 0];

  fisheye.x = function(d) {
    var dx = d.x - center[0],
        dy = d.y - center[1],
        dd = Math.sqrt(dx * dx + dy * dy);
    return dd < radius
        ? center[0] + dx * (k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25)
        : d.x;
  };

  fisheye.y = function(d) {
    var dx = d.x - center[0],
        dy = d.y - center[1],
        dd = Math.sqrt(dx * dx + dy * dy);
    return dd < radius
        ? center[1] + dy * (k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25)
        : d.y;
  };

  fisheye.size = function(d) {
    var dx = d.x - center[0],
        dy = d.y - center[1],
        dd = Math.sqrt(dx * dx + dy * dy);
    return dd < radius
        ? Math.min(k0 * (1 - Math.exp(-dd * k1)) / dd, 10)
        : 1;
  };

  function rescale() {
    k0 = Math.exp(power);
    k0 = k0 / (k0 - 1) * radius;
    k1 = power / radius;
    return fisheye;
  }

  fisheye.radius = function(_) {
    if (!arguments.length) return radius;
    radius = +_;
    return rescale();
  };

  fisheye.power = function(_) {
    if (!arguments.length) return power;
    power = +_;
    return rescale();
  };

  fisheye.center = function(_) {
    if (!arguments.length) return center;
    center = _;
    return fisheye;
  };

  return rescale();
};
