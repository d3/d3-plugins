(function(d3) {
  d3.graph = function (graph) {
    var graph = graph ? graph : {},
        nodes = [],
        links = [];

    graph.description = function() {
      return "d3.graph with " + nodes.length + " nodes and " + links.length + " links";
    };

    graph.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return this;
    };

    graph.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return this;
    };

    graph.matrix = function(x) {
      if (!arguments.length) return d3.graph.listToMatrix(links);
      links = d3.graph.matrixToList(x);
      // TODO nodes
      return this;
    };

    graph.traverse = function() {
      var traversal = {},
          selected = {};            // selected entities

      traversal.filter = function(f) {
        // only works on nodes
        if (!arguments.length) return this;
        selected = nodes.filter(f);
        return this;
      };

      traversal.value = function(x) {
        if (!arguments.length) {
          // reset selection
          var result = selected;
          selected_type = false;
          selected = {};
          return result;
        }
        selected = x;
        return this;
      };

      traversal.selected_type = function(x) {
        if (!arguments.length) return selected_type;
        selected_type = x;
        return this;
      };

      return traversal;
    };

    return graph;
  };

  d3.graph.listToMatrix = function(links) {
    var matrix = [],
        n = links.length,
        max = d3.max(links, function(d) {
          return d3.max([d.source, d.target]);
        });

    // zero matrix
    var i = -1; while (++i <= max) {
      matrix[i] = [];
      var j = -1; while (++j <= max) {
        matrix[i][j] = 0;
      }
    }

    i = -1; while (++i < n) {
      matrix[ links[i].source ][ links[i].target ] = links[i].value;
    };
    
    return matrix;
  };

  d3.graph.matrixToList = function(matrix) {
    var links = [],
        n = matrix.length;

    var i = -1; while (++i < n) {
      var j = -1; while (++j < n) {
        links.push({
          source: i,
          target: j,
          value: matrix[i][j]
        });
      }
    }

    return links
  };


})(d3);
