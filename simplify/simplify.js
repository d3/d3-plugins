(function() {

d3.simplify = function() {
  var projection = d3.geo.albers(),
      heap,
      minArea = 3;

  var triangulateCoordinates = {
    MultiPolygon: triangulateMultiPolygon,
    Polygon: triangulatePolygon,
    MultiLineString: triangulatePolygon,
    LineString: triangulateLineString
  };

  var simplifyCoordinates = {
    MultiPolygon: simplifyMultiPolygon,
    Polygon: simplifyPolygon,
    MultiLineString: simplifyPolygon,
    LineString: simplifyLineString
  };

  function simplify(object) {
    var type = object.type;
    if (type === "FeatureCollection") {
      return {
        type: "FeatureCollection",
        features: object.features.map(simplifyFeature).filter(nonemptyFeature)
      };
    }
    return (type === "Feature" ? simplifyFeature : simplifyGeometry)(object);
  }

  simplify.project = function(feature) {
    var maxArea = 0,
        triangle;

    heap = minHeap();
    triangulate(feature);

    while (triangle = heap.pop()) {

      // If the area of the current point is less than that of the previous point
      // to be eliminated, use the latter’s area instead. This ensures that the
      // current point cannot be eliminated without eliminating previously-
      // eliminated points.
      if (triangle[1][2] < maxArea) triangle[1][2] = maxArea;
      else maxArea = triangle[1][2];

      if (triangle.previous) {
        triangle.previous.next = triangle.next;
        triangle.previous[2] = triangle[2];
        update(triangle.previous);
      } else {
        triangle[0][2] = triangle[1][2];
      }

      if (triangle.next) {
        triangle.next.previous = triangle.previous;
        triangle.next[0] = triangle[0];
        update(triangle.next);
      } else {
        triangle[2][2] = triangle[1][2];
      }
    }

    function update(triangle) {
      heap.remove(triangle);
      triangle[1][2] = area(triangle);
      heap.push(triangle);
    }

    heap = null;
    return feature;
  };

  function triangulate(object) {
    var type = object.type;
    if (type === "FeatureCollection") object.features.forEach(triangulateFeature);
    else (type === "Feature" ? triangulateFeature : triangulateGeometry)(object);
  }

  function triangulateFeature(feature) {
    triangulateGeometry(feature.geometry);
  }

  function triangulateGeometry(geometry) {
    var type = geometry.type;
    if (type === "GeometryCollection") geometry.geometries.forEach(triangulateGeometry);
    else geometry.coordinates = triangulateCoordinates[type](geometry.coordinates);
  }

  function triangulateMultiPolygon(multiPolygon) {
    return multiPolygon.map(triangulatePolygon);
  }

  function triangulatePolygon(polygon) {
    return polygon.map(triangulateLineString);
  }

  function triangulateLineString(lineString) {
    var points = lineString.map(projection),
        triangle,
        triangles = [];

    for (var i = 1, n = lineString.length - 1; i < n; ++i) {
      triangle = points.slice(i - 1, i + 2);
      if (triangle[1][2] = area(triangle)) {
        triangles.push(triangle);
        heap.push(triangle);
      }
    }

    for (var i = 0, n = triangles.length; i < n; ++i) {
      triangle = triangles[i];
      triangle.previous = triangles[i - 1];
      triangle.next = triangles[i + 1];
    }

    return points;
  }

  function simplifyFeature(feature) {
    return {
      type: "Feature",
      geometry: simplifyGeometry(feature.geometry)
    };
  }

  function simplifyGeometry(geometry) {
    var type = geometry.type;
    return type === "GeometryCollection"
        ? {type: type, geometries: geometry.geometries.map(simplifyGeometry).filter(nonemptyGeometry)}
        : {type: type, coordinates: simplifyCoordinates[type](geometry.coordinates)};
  }

  function simplifyMultiPolygon(multiPolygon) {
    return multiPolygon.map(simplifyPolygon).filter(length);
  }

  function simplifyPolygon(polygon) {
    return polygon.map(simplifyLineString).filter(length);
  }

  function simplifyLineString(lineString) {
    return lineString.filter(function(point) {
      return point[2] >= minArea;
    });
  }

  simplify.projection = function(_) {
    if (!arguments.length) return projection;
    projection = _;
    return simplify;
  };

  simplify.area = function(_) {
    if (!arguments.length) return minArea;
    minArea = +_;
    return simplify;
  };

  return simplify;
};

function compare(a, b) {
  return a[1][2] - b[1][2];
}

function area(t) {
  return Math.abs((t[0][0] - t[2][0]) * (t[1][1] - t[0][1]) - (t[0][0] - t[1][0]) * (t[2][1] - t[0][1]));
}

function minHeap() {
  var heap = {},
      array = [];

  heap.push = function() {
    for (var i = 0, n = arguments.length; i < n; ++i) {
      var object = arguments[i];
      up(object.index = array.push(object) - 1);
    }
    return array.length;
  };

  heap.pop = function() {
    var removed = array[0],
        object = array.pop();
    if (array.length) {
      array[object.index = 0] = object;
      down(0);
    }
    return removed;
  };

  heap.remove = function(removed) {
    var i = removed.index,
        object = array.pop();
    if (i !== array.length) {
      array[object.index = i] = object;
      (compare(object, removed) < 0 ? up : down)(i);
    }
    return i;
  };

  function up(i) {
    var object = array[i];
    while (i > 0) {
      var up = ((i + 1) >> 1) - 1,
          parent = array[up];
      if (compare(object, parent) >= 0) break;
      array[parent.index = i] = parent;
      array[object.index = i = up] = object;
    }
  }

  function down(i) {
    var object = array[i];
    while (true) {
      var right = (i + 1) << 1,
          left = right - 1,
          down = i,
          child = array[down];
      if (left < array.length && compare(array[left], child) < 0) child = array[down = left];
      if (right < array.length && compare(array[right], child) < 0) child = array[down = right];
      if (down === i) break;
      array[child.index = i] = child;
      array[object.index = i = down] = object;
    }
  }

  return heap;
}

function nonemptyFeature(d) { return nonemptyGeometry(d.geometry); }

function nonemptyGeometry(d) {
  return length(d.type === "GeometryCollection"
      ? d.geometries : d.coordinates);
}

function length(d) { return d.length; }

})();
