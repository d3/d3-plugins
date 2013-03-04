d3.geo.auxiliary = function() {
  var datum = null,
      e = 0,
      type = "geodetic",
      aux = auxiliaryLatitude[type],
      auxφ = aux(e);

  function auxiliary(stream) {
    return {
      point: function(x, y) {
        stream.point(x, auxφ(y * radians) * degrees);
      },
      sphere: function() { stream.sphere(); },
      lineStart: function() { stream.lineStart(); },
      lineEnd: function() { stream.lineEnd(); },
      polygonStart: function() { stream.polygonStart(); },
      polygonEnd: function() { stream.polygonEnd(); }
    };
  }

  auxiliary.datum = function(_) {
    if (!arguments.length) return datum;
    e = +((_ = d3.geo.datum[datum = _ + ""]) ? _.eccentricity : datum = null);
    auxφ = aux(e = +_);
    return auxiliary;
  };

  auxiliary.eccentricity = function(_) {
    if (!arguments.length) return e;
    auxφ = aux(e = +_);
    datum = null;
    return auxiliary;
  };

  auxiliary.type = function(_) {
    if (!arguments.length) return type;
    auxφ = (aux = auxiliaryLatitude[type = _ + ""] || auxiliaryLatitude[type = "geodetic"])(e);
    return auxiliary;
  };

  return auxiliary;
};

d3.geo.auxiliary.latitude = auxiliaryLatitude;
