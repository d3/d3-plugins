(function() {

// Virtual rendering for rows taking up to 1e7px of vertical space.
// By Jason Davies, http://www.jasondavies.com/
d3.longscroll = function() {
  var render = null,
      size = 0,
      position = 0,
      rowHeight = 20;

  function longscroll(g) {
    g.selectAll("div.before").data([0]).enter().append("div").attr("class", "before");
    var current = g.selectAll("div.current").data([0]);
    current.enter().append("div").attr("class", "current");
    g.selectAll("div.after").data([0]).enter().append("div").attr("class", "after");

    g.on("scroll.longscroll", function() {
      position = Math.floor(this.scrollTop / rowHeight);
      scroll(this.scrollTop);
    });

    scroll(0);
    g.each(function() {
      var g = d3.select(this);
      g.property("scrollTop", +g.select(".before").style("height").replace("px", ""));
    });

    function scroll(scrollTop) {
      g.each(function() {
        this.scrollTop = scrollTop;
        var g = d3.select(this),
            rows = 1 + Math.ceil(this.clientHeight / rowHeight),
            position0 = Math.max(0, Math.min(size - rows, position)),
            position1 = position0 + rows;

        g.select(".before").style("height", position0 * rowHeight + "px");
        g.select(".after").style("height", (size - position1) * rowHeight + "px");

        var div = g.select(".current").selectAll("div.row")
            .data(d3.range(position0, Math.min(position1, size)), String);
        div.enter().append("div")
            .attr("class", "row");
        div.exit().remove();
        div.order().call(render);
      });
    }
  }

  longscroll.render = function(_) {
    return arguments.length ? (render = _, longscroll) : render;
  };

  longscroll.rowHeight = function(_) {
    return arguments.length ? (rowHeight = +_, longscroll) : rowHeight;
  };

  longscroll.position = function(_) {
    return arguments.length ? (position = +_, longscroll) : position;
  };

  longscroll.size = function(_) {
    return arguments.length ? (size = +_, longscroll) : size;
  };

  return longscroll;
};

})();
