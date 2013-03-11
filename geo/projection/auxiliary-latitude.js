var auxiliaryLatitude = {
  // Geodetic:
  geodetic: function() {
    return auxiliaryIdentity;
  },

  // Geocentric (more useful in derivations than in projections):
  //   ψ(φ) = tan⁻¹((1 - e²) tan φ)
  geocentric: function(e) {
    var f = 1 - e * e;
    return function(φ) {
      return Math.atan(f * Math.tan(φ));
    };
  },

  // Parametric (more useful in derivations than in projections):
  //   β(φ) = tan⁻¹(√(1 - e²) tan φ)
  parametric: function(e) {
    var f = Math.sqrt(1 - e * e);
    return function(φ) {
      return Math.atan(f * Math.tan(φ));
    };
  },

  // Rectifying:
  //   µ(φ) = π / 2 m(φ) / m_p
  //   m(φ) = a(1 - e²) ∫ (1 - e² sin²φ)^(3/2) dφ
  //   m_p = m(π / 2)
  rectifying: function(e) {
    var f = a * (1 - e * e),
        m_p = m(π / 2);

    function m(φ) {
      var sinφ = Math.sin(φ);
      // TODO
    }

    function forward(φ) {
      return π / 2 * m(φ) / m_p;
    }

    forward.invert = function(µ) {
    };

    return forward;
  },

  // Authalic (equal-area):
  //   β(φ) = sin⁻¹(q(φ) / q_p)
  //   q(φ) = (1 - e²) sin φ / (1 - e² sin²φ) + (1 - e²) / e² tanh⁻¹(e sin φ)
  //   q_p = q(π / 2) = 1 + (1 - e²) / e² tanh⁻¹(e)
  authalic: function(e) {
    var e2 = e * e,
        q_p = q(π / 2);

    function q(φ) {
      var sinφ = Math.sin(φ);
      return (1 - e2) * (sinφ / (1 - e2 * sinφ * sinφ) - .5 / e * Math.log((1 - e * sinφ) / (1 + e * sinφ)));
    }

    function forward(φ) {
      return Math.asin(q(φ) / q_p);
    }

    forward.invert = function(β) {
      var q = q_p * Math.sin(β),
          φ = Math.asin(q / 2),
          i = 50,
          δ;
      do {
        var sinφ = Math.sin(φ),
            t = 1 - e2 * sinφ * sinφ;
        φ += δ = .5 * t * t / Math.cos(φ) * (q / (1 - e2) - sinφ / t + .5 / e * Math.log((1 - e * sinφ) / (1 + e * sinφ)));
      } while (Math.abs(δ) > ε && --i > 0);
      return φ;
    };

    return forward;
  },

  // Conformal:
  //   χ(φ) = 2 tan⁻¹(tan(φ / 2 + π / 4) * ((1 - e sin φ) / (1 + e sin φ))^(e / 2)) - π / 2
  conformal: function(e) {
    function forward(φ) {
      var esinφ = e * Math.sin(φ);
      return 2 * Math.atan(Math.tan(φ / 2 + π / 4) * Math.pow((1 - esinφ) / (1 + esinφ), e / 2)) - π / 2;
    }

    forward.invert = function(χ) {
      var gdχ = Math.tan(χ / 2 + π / 4),
          φ = χ,
          i = 50,
          δ;
      do {
        var esinφ = e * Math.sin(φ);
        φ += δ = 2 * Math.atan(gdχ * Math.pow((1 + esinφ) / (1 - esinφ), e / 2)) - π / 2 - φ;
      } while (Math.abs(δ) > ε && --i > 0);
      return φ;
    };

    return forward;
  },

  // Isometric:
  //   ψ(φ) = sinh⁻¹(tan φ) - e tanh⁻¹(e sin φ)
  isometric: function(e) {
    var conformal = auxiliaryLatitude.conformal(e);

    function forward(φ) {
      var esinφ = e * Math.sin(φ);
      return Math.log(Math.tan(φ / 2 + π / 4)) + e / 2 * Math.log((1 - esinφ) / (1 + esinφ));
    }

    forward.invert = function(ψ) {
      return conformal.invert(2 * Math.atan(Math.exp(ψ)) - π / 2);
    };

    return forward;
  }
};

function auxiliaryIdentity(φ) { return φ; }
auxiliaryIdentity.invert = function(φ) { return φ; };
