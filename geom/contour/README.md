# d3.geom.contour

Computes a contour for a given input grid function using the [marching squares](http://en.wikipedia.org/wiki/Marching_squares) algorithm. Returns the contour polygon as an array of points.

d3.geom.contour(**grid**, **start**)

* **grid** a two-input function(x, y) that returns true for values inside the contour and false for values outside the contour.
* **start** an optional starting point [x, y] on the grid.

Returns a polygon in the format: [[x1, y1], [x2, y2], …]
