require("d3");
require("../../../d3.geo.projection");

var assert = require("assert");

assert.inDelta = function(actual, expected, delta, message) {
  if (!inDelta(actual, expected, delta)) {
    assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDelta);
  }
};

assert.equalInverse = function(projection, location, point) {
  var projected;
  assert.inDelta(projected = projection(location), point, 1e-6);
  assert.inDelta(projection.invert(projected), location, 1e-6);
  assert.inDelta(projection(projection.invert(point)), point, 1e-6);
};

function inDelta(actual, expected, delta) {
  return (Array.isArray(expected) ? inDeltaArray : inDeltaNumber)(actual, expected, delta);
}

function inDeltaArray(actual, expected, delta) {
  var n = expected.length, i = -1;
  if (actual.length !== n) return false;
  while (++i < n) if (!inDelta(actual[i], expected[i], delta)) return false;
  return true;
}

function inDeltaNumber(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}
