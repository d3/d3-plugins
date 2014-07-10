# Hexagonal Binning

Examples:

* Color encoding: <http://bl.ocks.org/4248145>
* Area encoding: <http://bl.ocks.org/4248146>

The **d3.hexbin** plugin implements **hexagonal binning**, which is useful for aggregating data into a more coarse representation suitable for display. Rather than displaying a scatterplot with tens of thousands of points, you can bin points into gridded hexagons, and then display the distribution using color or area. This plugin was inspired by earlier work by [Zachary Forest Johnson](http://indiemaps.com/blog/2011/10/hexbins/).

<a name="hexbin" href="#hexbin">#</a> d3.<b>hexbin</b>()

Constructs a new default hexbin layout.

<a name="_hexbin" href="#_hexbin">#</a> <b>hexbin</b>(<i>points</i>)

Evaluates the hexbin layout on the specified array of *points*, returning an array of hexagonal *bins*. Each bin is an array containing the bin’s points, as well as some additional properties:

* x - the x-coordinate of the center of the associated bin’s hexagon
* y - the y-coordinate of the center of the associated bin’s hexagon

Bins that are empty are not omitted. The origin bin at ⟨0,0⟩ is in the top-left. The returned bins are designed to work with the layouts point and hexagon methods.

<a href="size" href="#size">#</a> hexbin.<b>size</b>([<i>size</i>])

If *size* is specified, sets the available layout size to the specified two-element array of numbers representing *x* and *y*. If *size* is not specified, returns the current size, which defaults to 1×1.

<a href="radius" href="#radius">#</a> hexbin.<b>radius</b>([<i>radius</i>])

If *radius* is specified, sets the hexagon radius to the specified numeric value. If *radius* is not specified, returns the current radius, which defaults to 1.

<a name="x" href="#x">#</a> hexbin.<b>x</b>([<i>accessor</i>])

Sets or gets the *x*-accessor function for the hexbin layout. If *accessor* is specified, sets the *x*-accessor function and returns the hexbin layout; if *accessor* is not specified, returns the current *x*-accessor function, which defaults to `function(d) { return d[0]; }`.

<a name="y" href="#y">#</a> hexbin.<b>y</b>([<i>accessor</i>])

Sets or gets the *y*-accessor function for the hexbin layout. If *accessor* is specified, sets the *y*-accessor function and returns the hexbin layout; if *accessor* is not specified, returns the current *y*-accessor function, which defaults to `function(d) { return d[1]; }`.

<a href="hexagon" href="#hexagon">#</a> hexbin.<b>hexagon</b>([<i>radius</i>])

Returns the SVG path string for the hexagon centered at the origin ⟨0,0⟩. The path string is defined with relative coordinates such that you can easily translate the hexagon to the desired position. For example:

```js
path.attr("d", function(d) { return "M" + d.x + "," + d.y + hexbin.hexagon(); });
```

Alternatively, use a transform attribute:

```js
path.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .attr("d", hexbin.hexagon());
```

If *radius* is not specified, the hexbin’s current radius is used. If *radius* is specified, a hexagon with the specified radius is returned, which is useful for area-encoded bivariate hexbins.

<a href="centers" href="#centers">#</a> hexbin.<b>centers</b>()

Returns an array of [*x*, *y*] points representing the centers of each hexagon. Each point also has properties *i* and *j* representing the grid column and row, respectively, of the hexagon.

<a href="mesh" href="#mesh">#</a> hexbin.<b>mesh</b>()

Returns the SVG path string for a hexagonal mesh that covers the area of the layout (as determined by the layout size). The returned mesh is designed to be stroked. The mesh may extend slightly beyond the layout’s defined area, and thus may need to be clipped.
