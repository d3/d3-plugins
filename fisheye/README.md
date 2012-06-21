# Fisheye Distortion

Demo: <http://bost.ocks.org/mike/fisheye/>

Implements a fisheye distortion for two-dimensional layouts. Based on Sarkar and Brown’s [Graphical Fisheye Views of Graphs](http://dl.acm.org/citation.cfm?id=142763) (CHI '92), as well as [Flare](http://flare.prefuse.org/)'s [FisheyeDistortion](http://flare.prefuse.org/api/flare/vis/operator/distortion/FisheyeDistortion.html) and [Sigma.js](http://sigmajs.org/)'s [fisheye example](http://sigmajs.org/examples/a_plugin_example_advanced.html).

When constructing a fisheye distortion, you can specify the radius and distortion factor:

```js
var fisheye = d3.fisheye.circular()
    .radius(200)
    .distortion(2);
```

Typically, you then update the focal point of the distortion on mousemove:

```js
svg.on("mousemove", function() {
  fisheye.focus(d3.mouse(this));
});
```

The distortion operator takes as input an object with `x` and `y` attributes, and returns a new object with `x`, `y` and `z` attributes. The returned object represents the distorted position of the input object; the `z` property is a scaling factor so that you can optionally distort the size of elements as well.

For example, to apply fisheye distortion to a force layout, stash the distorted positions in a `display` property on each node, and then use the distorted positions to update the nodes and links:

```js
svg.on("mousemove", function() {
  fisheye.focus(d3.mouse(this));

  node.each(function(d) { d.fisheye = fisheye(d); })
      .attr("cx", function(d) { return d.fisheye.x; })
      .attr("cy", function(d) { return d.fisheye.y; })
      .attr("r", function(d) { return d.fisheye.z * 4.5; });

  link.attr("x1", function(d) { return d.source.fisheye.x; })
      .attr("y1", function(d) { return d.source.fisheye.y; })
      .attr("x2", function(d) { return d.target.fisheye.x; })
      .attr("y2", function(d) { return d.target.fisheye.y; });
});
```

There's also a d3.fisheye.scale for Cartesian distortion; see the above demo for an example.
