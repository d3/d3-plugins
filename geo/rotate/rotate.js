(function() {
  d3.geo.rotate = function(z, y, x) {
    if (!(x = +x || 0) && !(y = +y || 0) && !(z = +z || 0)) {
      return identity;
    }

    var m = matrix(y, x),
        zAngle = z,
        radians = Math.PI / 180;

    function rotate(λ, φ) {
      λ += zAngle;
      var cφ = Math.cos(φ),
          x = Math.cos(λ) * cosφ,
          y = Math.sin(λ) * cosφ,
          z = Math.sin(φ),
          mx = m[0],
          my = m[1],
          mz = m[2];
      mx = x * mx[0] + y * mx[1] + z * mx[2];
      my = x * my[0] + y * my[1] + z * my[2];
      mz = x * mz[0] + y * mz[1] + z * mz[2];
      return [
        Math.atan2(my, mx),
        Math.asin(mz)
      ];
    }

    return rotate;
  };

  function matrix(y, x) {
    var cy = Math.cos(y *= radians),
        sy = Math.sin(y),
        cx = Math.cos(x *= radians),
        sx = Math.sin(x);
    return [
      [ cy,       0,      -sy],
      [-sx * sy, cx, -sx * cy],
      [ cx * sy, sx,  cx * cy]
    ];
  }

  function identity(λ, φ) { return [λ, φ]; }
})();
