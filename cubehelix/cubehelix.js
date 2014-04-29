d3.scale.cubehelix = function() {
  var linear = d3.scale.linear(),
      π = Math.PI,
      φ0 = 14 / 6 * π,
      φ1 = -2 / 3 * π,
      s = .6,
      γ = 1;

  function scale(x) {
    var λ = linear(x),
        φ = φ0 + λ * (φ1 - φ0),
        a = s * (λ = Math.pow(λ, γ)) * (1 - λ),
        r = λ + a * (-0.14861 * Math.cos(φ) + 1.78277 * Math.sin(φ)),
        g = λ + a * (-0.29227 * Math.cos(φ) - 0.90649 * Math.sin(φ)),
        b = λ + a * (+1.97294 * Math.cos(φ));
    return d3.rgb(
      (r <= 0 ? 0 : r >= 1 ? 1 : r) * 255 | 0,
      (g <= 0 ? 0 : g >= 1 ? 1 : g) * 255 | 0,
      (b <= 0 ? 0 : b >= 1 ? 1 : b) * 255 | 0
    );
  }

  scale.startHue = function(_) { // start color hue in degrees; defaults to 420°
    return arguments.length ? (φ0 = _ * π / 180, scale) : φ0 * 180 / π;
  };

  scale.endHue = function(_) { // end color hue in degrees; defaults to -120°
    return arguments.length ? (φ1 = _ * π / 180, scale) : φ1 * 180 / π;
  };

  scale.saturation = function(_) { // mean saturation in [0, 1]; defaults to .6
    return arguments.length ? (s = +_, scale) : s;
  };

  scale.gamma = function(_) { // gamma correction value; defaults to 1
    return arguments.length ? (γ = +_, scale) : γ;
  };

  d3.rebind(scale, linear, "domain", "clamp", "nice");

  return scale;
};
