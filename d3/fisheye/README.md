# Fisheye Distortion

Inspired by [Flare](http://flare.prefuse.org/)'s [FisheyeDistortion](http://flare.prefuse.org/api/flare/vis/operator/distortion/FisheyeDistortion.html) and [sigma.js](http://sigmajs.org/examples/a_plugin_example_advanced.html).

Example usage:

```js
svg.on("mousemove", function() {
  fisheye.center(d3.mouse(this));

  link
      .attr("x1", function(d) { return fisheye.x(d.source); })
      .attr("y1", function(d) { return fisheye.y(d.source); })
      .attr("x2", function(d) { return fisheye.x(d.target); })
      .attr("y2", function(d) { return fisheye.y(d.target); });

  node
      .attr("cx", fisheye.x)
      .attr("cy", fisheye.y)
      .attr("r", function(d) { return fisheye.size(d) * 4.5; })
});
```
