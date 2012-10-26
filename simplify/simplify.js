(function() {

d3.simplify = function() {
  var projection = d3.geo.albers(),
      heap,
      minArea = 3,
      topology = false;

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
      object = copy(object);
      object.features = object.features.map(simplifyFeature).filter(nonemptyFeature);
      return object;
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
      if (triangle[1].area < maxArea) triangle[1].area = maxArea;
      else maxArea = triangle[1].area;

      if (triangle.previous) {
        triangle.previous.next = triangle.next;
        triangle.previous.area = triangle.area;
        update(triangle.previous);
      } else if (!topology) {
        triangle[0].area = triangle[1].area;
      }

      if (triangle.next) {
        triangle.next.previous = triangle.previous;
        triangle.next[0] = triangle[0];
        update(triangle.next);
      } else if (!topology) {
        triangle[2].area = triangle[1].area;
      }
    }

    function update(triangle) {
      heap.remove(triangle);
      triangle[1].area = area(triangle);
      heap.push(triangle);
    }

    heap = null;
    return feature;
  };

  function triangulate(object) {
    if (topology) triangulateTopology(object);
    else {
      var type = object.type;
      if (type === "FeatureCollection") object.features.forEach(triangulateFeature);
      else (type === "Feature" ? triangulateFeature : triangulateGeometry)(object);
    }
  }

  function triangulateTopology(object) {
    var id = 0,
        ringId = 0,
        idByRings = {},
        ringByPoint = {},
        type = object.type,
        topologyCoordinates = {
          MultiPolygon: topologyMultiPolygon,
          Polygon: topologyPolygon,
          MultiLineString: topologyPolygon,
          LineString: topologyLineString
        },
        triangulateCoordinates = {
          MultiPolygon: triangulateMultiPolygon,
          Polygon: triangulatePolygon,
          MultiLineString: triangulatePolygon,
          LineString: triangulateLineString0
        };

    if (type === "FeatureCollection") {
      object.features.forEach(topologyFeature);
      object.features.forEach(triangulateFeature);
    } else if (type === "Feature") {
      topologyFeature(object);
      triangulateFeature(object);
    } else {
      topologyGeometry(object);
      triangulateGeometry(object);
    }

    function topologyFeature(feature) { return topologyGeometry(feature.geometry); }

    function topologyGeometry(geometry) {
      var type = geometry.type;
      if (type === "GeometryCollection") geometry.geometries.forEach(topologyGeometry);
      else topologyCoordinates[type](geometry.coordinates);
    }

    function topologyMultiPolygon(multiPolygon) { multiPolygon.forEach(topologyPolygon); }
    function topologyLineString(lineString) { topologyPolygon([lineString]); }

    function topologyPolygon(polygon) {
      polygon.forEach(function(ring) {
        ++ringId;
        ring.forEach(function(point) {
          point = point.join(",");
          var key = ringByPoint.hasOwnProperty(point) ? ringByPoint[point] + ":" + ringId : ringId;
          ringByPoint[point] = idByRings.hasOwnProperty(key) ? idByRings[key] : (idByRings[key] = ++id);
        });
      });
    }

    function triangulateFeature(feature) { triangulateGeometry(feature.geometry); }
    function triangulateGeometry(geometry) {
      var type = geometry.type;
      if (type === "GeometryCollection") geometry.geometries.forEach(topologyGeometry);
      else geometry.coordinates = triangulateCoordinates[type](geometry.coordinates);
    }

    function triangulateMultiPolygon(multiPolygon) { return multiPolygon.map(triangulatePolygon); }
    function triangulatePolygon(polygon) { return polygon.map(triangulateLineString0); }

    function triangulateLineString0(lineString) {
      var result = [],
          id0,
          i0 = 0;
      lineString.forEach(function(point, i) {
        var id = ringByPoint[point.join(",")];
        if (id !== id0) {
          if (id0) {
            var chain = triangulateLineString(lineString.slice(i0, i0 = i));
            chain[0].area = chain[chain.length - 1].area = Infinity;
            result = result.concat(chain);
          }
          id0 = id;
        }
      });
      var chain = triangulateLineString(i0 ? lineString.slice(i0) : lineString);
      chain[0].area = chain[chain.length - 1].area = Infinity;
      return result.concat(chain);
    }
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
      triangle[1].area = area(triangle);
      triangles.push(triangle);
      heap.push(triangle);
    }

    points[0].area = points[n].area = 0;

    for (var i = 0, n = triangles.length; i < n; ++i) {
      triangle = triangles[i];
      triangle.previous = triangles[i - 1];
      triangle.next = triangles[i + 1];
    }

    return points;
  }

  function simplifyFeature(feature) {
    feature = copy(feature);
    feature.geometry = simplifyGeometry(feature.geometry);
    return feature;
  }

  function simplifyGeometry(geometry) {
    var type = geometry.type;
    geometry = copy(geometry);
    if (type === "GeometryCollection") {
      geometry.geometries = geometry.geometries.map(simplifyGeometry).filter(nonemptyGeometry);
    } else {
      geometry.coordinates = simplifyCoordinates[type](geometry.coordinates);
    }
    return geometry;
  }

  function simplifyMultiPolygon(multiPolygon) {
    return multiPolygon.map(simplifyPolygon).filter(length);
  }

  function simplifyPolygon(polygon) {
    return polygon.map(simplifyLineString).filter(length);
  }

  function simplifyLineString(lineString) {
    return lineString.filter(filterLineString);
  }

  function filterLineString(point) {
    return point.area >= minArea;
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

  simplify.topology = function(_) {
    if (!arguments.length) return topology;
    topology = !!_;
    return simplify;
  };

  return simplify;
};

function compare(a, b) {
  return a[1].area - b[1].area;
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

function copy(object) {
  var o = {};
  for (var key in object) o[key] = object[key];
  return o;
}

})();
