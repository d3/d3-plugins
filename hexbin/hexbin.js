(function() {

d3.hexbin = {
  mesh: function(width, height, radius) {
    var path = [],
        dx = radius * 1.5,
        dy = radius * 2 * Math.sin(Math.PI / 3),
        mesh = hexagon(radius).slice(3).join("l");

    for (var y = 0, i = 0; y < height + radius; y += dx, ++i) {
      for (var x = i & 1 ? -dy / 2 : 0; x < width + dy / 2; x += dy) {
        path.push("M", x, ",", y, "m", mesh);
      }
    }

    return path.join("");
  }
};

function hexagon(radius) {
  return d3.range(0, 2 * Math.PI, Math.PI / 3).map(function(angle) {
    return [Math.sin(angle) * radius, -Math.cos(angle) * radius];
  });
}

})();
