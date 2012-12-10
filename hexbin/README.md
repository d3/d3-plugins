# Hexagonal Binning

Demo (Color): <http://bl.ocks.org/4248145>

Demo (Area): <http://bl.ocks.org/4248146>

The **d3.hexbin** plugin implements **hexagonal binning**, which is useful for aggregating data into a more coarse representation suitable for display. Rather than displaying a scatterplot with tens of thousands of points, you can bin points into gridded hexagons, and then display the distribution using color or area.

## API Reference

<a name="hexbin" href="#wiki-hexbin">#</a> d3.<b>hexbin</b>()

Constructs a new default hexbin layout.

<a name="_hexbin" href="#wiki-_hexbin">#</a> <b>hexbin</b>(<i>points</i>)

Evaluates the hexbin layout on the specified array of *points*, return an array of hexagonal *bins*. Each bin has several attributes:

* i - the x-coordinate of the bin
* j - the y-coordinate of the bin
* points - the array of points contained by this bin

Bins that are empty are not omitted. The origin bin at ⟨0,0⟩ is in the top-left. The returned bins are designed to work with the layouts point and hexagon methods.

<a href="size" href="#wiki-size">#</a> hexbin.<b>size</b>([<i>size</i>])

If *size* is specified, sets the available layout size to the specified two-element array of numbers representing *x* and *y*. If *size* is not specified, returns the current size, which defaults to 1×1.

<a href="radius" href="#wiki-radius">#</a> hexbin.<b>radius</b>([<i>radius</i>])

If *radius* is specified, sets the hexagon radius to the specified numeric value. If *radius* is not specified, returns the current radius, which defaults to 1.

<a name="x" href="#wiki-x">#</a> hexbin.<b>x</b>([<i>accessor</i>])

Sets or gets the *x*-accessor function for the hexbin layout. If *accessor* is specified, sets the *x*-accessor function and returns the hexbin layout; if *accessor* is not specified, returns the current *x*-accessor function, which defaults to `function(d) { return d[0]; }`.

<a name="y" href="#wiki-y">#</a> hexbin.<b>y</b>([<i>accessor</i>])

Sets or gets the *y*-accessor function for the hexbin layout. If *accessor* is specified, sets the *y*-accessor function and returns the hexbin layout; if *accessor* is not specified, returns the current *y*-accessor function, which defaults to `function(d) { return d[1]; }`.

<a href="point" href="#wiki-point">#</a> hexbin.<b>point</b>(bin)

Converts the specified *bin* to world coordinates, returning a two-element array [*x*, *y*].

<a href="hexagon" href="#wiki-hexagon">#</a> hexbin.<b>hexagon</b>([bin])

Returns the SVG path string for the hexagon representing the specified *bin*. If no bin is specified, returns a hexagon centered at the origin ⟨0,0⟩.

<a href="mesh" href="#wiki-mesh">#</a> hexbin.<b>mesh</b>()

Returns the SVG path string for a hexagonal mesh that covers the area of the layout (as determined by the layout size). The returned mesh is designed to be stroked.
