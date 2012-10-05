Computes a contour for a given input grid function using the <a href="http://en.wikipedia.org/wiki/Marching_squares">marching squares</a> algorithm. Returns the contour polygon as an array of points.

@param grid a two-input function(x, y) that returns true for values inside the contour and false for values outside the contour.
@param start an optional starting point [x, y] on the grid.
@returns polygon [[x1, y1], [x2, y2], …]
