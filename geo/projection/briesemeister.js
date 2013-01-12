// @import hammer

var briesemeister = hammer(1.75, 2);

(d3.geo.briesemeister = function() { return projection(briesemeister); }).raw = briesemeister;
