# Fisheye Distortion

Demo: <http://bost.ocks.org/mike/fisheye/>

Implements a fisheye distortion for two-dimensional layouts. Based on Sarkar and Brown’s [Graphical Fisheye Views of Graphs](http://dl.acm.org/citation.cfm?id=142763) (CHI '92), as well as [Flare](http://flare.prefuse.org/)'s [FisheyeDistortion](http://flare.prefuse.org/api/flare/vis/operator/distortion/FisheyeDistortion.html) and [sigma.js](http://sigmajs.org/)'s [fisheye example](http://sigmajs.org/examples/a_plugin_example_advanced.html).

When constructing a fisheye distortion, you can specify the radius and power:

```js
var fisheye = d3.fisheye()
    .radius(200)
    .power(2);
```

Typically, you then update the center (the focal point) of the distortion on mousemove:

```js
svg.on("mousemove", function() {
  fisheye.center(d3.mouse(this));
});
```

The distortion operator takes as input an object with `x` and `y` attributes, and returns a new object with `x`, `y` and `z` attributes. The returned object represents the distorted position of the input object; the `z` property is a scaling factor so that you can optionally distort the size of elements as well.

For example, to apply fisheye distortion to a force layout, stash the distorted positions in a `display` property on each node, and then use the distorted positions to update the nodes and links:

```js
svg.on("mousemove", function() {
  fisheye.center(d3.mouse(this));

  node
      .each(function(d) { d.display = fisheye(d); })
      .attr("cx", function(d) { return d.display.x; })
      .attr("cy", function(d) { return d.display.y; })
      .attr("r", function(d) { return d.display.z * 4.5; });

  link
      .attr("x1", function(d) { return d.source.display.x; })
      .attr("y1", function(d) { return d.source.display.y; })
      .attr("x2", function(d) { return d.target.display.x; })
      .attr("y2", function(d) { return d.target.display.y; });
});
```
