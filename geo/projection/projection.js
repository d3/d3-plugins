var ε = 1e-6,
    ε2 = ε * ε,
    π = Math.PI,
    sqrtπ = Math.sqrt(π),
    radians = π / 180,
    degrees = 180 / π;

var projection = d3.geo.projection,
    projectionMutator = d3.geo.projectionMutator;

function sinci(x) {
  return x ? x / Math.sin(x) : 1;
}

function sgn(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function asqrt(x) {
  return x > 0 ? Math.sqrt(x) : 0;
}

function asin(x) {
  return x > 1 ? π / 2 : x < -1 ? -π / 2 : Math.asin(x);
}

function acos(x) {
  return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
}
