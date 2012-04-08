(function(d3) {
  d3.data = d3.data || {};

  d3.data.graph = function () {
    var graph = {},
        nodes = [],
        links = [];

    graph.description = function() {
      return "d3.data.graph with " + nodes.length + " nodes and " + links.length + " links";
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

    var pack = {
      matrix: function(links) {
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
      }
    };

    var unpack = {
      matrix: function(matrix) {
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
      }
    };

    graph.matrix = function(x) {
      if (!arguments.length) return pack.matrix(links);
      links = unpack.matrix(x);
      // TODO nodes
      return this;
    };

    return graph;
  };

})(d3);
