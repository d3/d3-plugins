(function() {

d3.simplify = function() {
  var projection = d3.geo.albers(),
      triangulateLineString = triangulateLineStringSimple,
      heap,
      minArea = 3,
      topology = false,
      ringId,
      id,
      idByRings,
      idByPoint,
      ringsByPoint,
      sharedPoints,
      lastRingByPoint,
      isShared,
      graph;

  var projectCoordinates = {
    MultiPolygon: projectMultiPolygon,
    Polygon: projectPolygon,
    MultiLineString: projectPolygon,
    LineString: projectLineString
  };

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
        maxAreas = {},
        triangle;

    heap = minHeap();

    if (topology) {
      id = 0;
      idByRings = {};
      ringsByPoint = {};
      idByPoint = {};
      sharedPoints = {};
      lastRingByPoint = {};
      isShared = {};
      graph = {};
      triangulateTopology(feature);
    } else {
      triangulateSimple(feature);
    }

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
      } else if (topology) {
        maxAreas[triangle.ring] = triangle[1][2];
      } else {
        triangle[0][2] = triangle[1][2];
      }

      if (triangle.next) {
        triangle.next.previous = triangle.previous;
        triangle.next[0] = triangle[0];
        update(triangle.next);
      } else if (topology) {
        maxAreas[triangle.ring] = triangle[1][2];
      } else {
        triangle[2][2] = triangle[1][2];
      }
    }

    function update(triangle) {
      heap.remove(triangle);
      triangle[1][2] = area(triangle);
      heap.push(triangle);
    }

    if (topology) {
      var seen = {},
          max,
          m,
          c;
      for (var key in graph) {
        if (seen.hasOwnProperty(key)) continue;
        max = 0;
        for (var k in (c = components(graph, key))) if ((m = maxAreas[k]) > max) max = m;
        for (var k in c) maxAreas[k] = max, seen[k] = 1;
      }

      for (var key in sharedPoints) {
        maxArea = maxAreas[ringsByPoint[key][0]];
        sharedPoints[key].forEach(function(point) { point[2] = maxArea; });
      }
      idByPoint = idByRings = ringsByPoint = sharedPoints = isShared = lastRingByPoint = graph = null;
    }

    heap = null;
    return feature;
  };

  function components(graph, source) {
    var seen = {},
        nextLevel = {},
        thisLevel,
        empty;
    nextLevel[source] = 1;
    while (1) {
      empty = true;
      for (var k in nextLevel) empty = false;
      if (empty) break;
      thisLevel = nextLevel;
      nextLevel = {};
      for (var v in thisLevel) {
        if (seen.hasOwnProperty(v)) continue;
        seen[v] = 1;
        var neighbors = graph[v];
        for (var k in neighbors) nextLevel[k] = neighbors[k];
      }
    }
    return seen;
  }

  function projectFeature(feature) {
    projectGeometry(feature.geometry);
  }

  function projectGeometry(geometry) {
    var type = geometry.type;
    if (type === "GeometryCollection") geometry.geometries.forEach(projectGeometry);
    else geometry.coordinates = projectCoordinates[type](geometry.coordinates);
  }

  function projectMultiPolygon(multiPolygon) {
    return multiPolygon.map(projectPolygon);
  }

  function projectPolygon(polygon) {
    return polygon.map(projectLineString);
  }

  function projectLineString(lineString) {
    ++ringId;
    return lineString.map(projectPoint);
  }

  function projectPoint(point) {
    var pointKey = (point = projection(point))[0] + "," + point[1],
        key = (idByPoint.hasOwnProperty(pointKey) ? idByPoint[pointKey] + ":" : "") + ringId;
    idByPoint[pointKey] = idByRings.hasOwnProperty(key)
        ? idByRings[key]
        : idByRings[key] = ++id;
    if (lastRingByPoint.hasOwnProperty(pointKey) && lastRingByPoint[pointKey] !== ringId) {
      isShared[pointKey] = 1;
    }
    lastRingByPoint[pointKey] = ringId;
    return point;
  }

  function triangulateLineStringTopology(lineString) {
    ++ringId;
    var n = lineString.length - 1,
        triangle0,
        triangle,
        a = lineString[0],
        b = lineString[1],
        c,
        key0,
        key,
        idA = idByPoint[a[0] + "," + a[1]],
        idB = idByPoint[key0 = b[0] + "," + b[1]],
        idC;

    lineString[0][2] = lineString[n][2] = 0;
    if (n < 2) return lineString;

    graph[ringId] = {};

    addSharedPoint(a);
    for (var i = 2; i <= n; ++i, a = b, b = c, idA = idB, idB = idC, key0 = key) {
      c = lineString[i];
      idC = idByPoint[key = c[0] + "," + c[1]];
      if (idA === idB && idB === idC || !isShared.hasOwnProperty(key0)) {
        triangle = [a, b, c];
        triangle.ring = ringId;
        b[2] = area(triangle);
        heap.push(triangle);
        if (triangle0) (triangle.previous = triangle0).next = triangle;
        triangle0 = triangle;
      } else {
        addSharedPoint(b);
        triangle0 = null;
      }
    }
    addSharedPoint(b);

    function addSharedPoint(point) {
      var key = point[0] + "," + point[1],
          rings = ringsByPoint.hasOwnProperty(key) ? ringsByPoint[key] : (ringsByPoint[key] = []);
      rings.forEach(function(ring) {
        graph[ring][ringId] = graph[ringId][ring] = 1;
      });
      rings.push(ringId);
      if (sharedPoints.hasOwnProperty(key)) sharedPoints[key].push(point);
      else sharedPoints[key] = [point];
    }

    return lineString;
  }

  // Project and triangulate.
  function triangulateLineStringSimple(lineString) {
    var points = lineString.map(projection),
        n = points.length - 1,
        triangle0,
        triangle,
        a = points[0],
        b = points[1],
        c;

    points[0][2] = points[n][2] = 0;

    for (var i = 2; i <= n; ++i) {
      triangle = [a, b, c = points[i]];
      b[2] = area(triangle);
      heap.push(triangle);
      if (triangle0) (triangle.previous = triangle0).next = triangle;
      triangle0 = triangle;
      a = b;
      b = c;
    }

    return points;
  }

  function triangulateSimple(object) {
    var type = object.type;
    if (type === "FeatureCollection") object.features.forEach(triangulateFeature);
    else (type === "Feature" ? triangulateFeature : triangulateGeometry)(object);
  }

  function triangulateTopology(object) {
    var type = object.type;
    ringId = 0;
    if (type === "FeatureCollection") {
      object.features.forEach(projectFeature);
      ringId = 0;
      object.features.forEach(triangulateFeature);
    } else if (type === "Feature") {
      projectFeature(object);
      ringId = 0;
      triangulateFeature(object);
    } else {
      projectGeometry(object);
      ringId = 0;
      triangulateGeometry(object);
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
    return point[2] >= minArea;
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
    triangulateCoordinates.LineString =
    triangulateLineString = (topology = !!_)
        ? triangulateLineStringTopology
        : triangulateLineStringSimple;
    return simplify;
  };

  return simplify;
};

function compare(a, b) {
  return a[1][2] - b[1][2] || a[1][1] - b[1][1] || a[1][0] - b[1][0];
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
