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

    return graph;
  };

  // http://opendatastructures.org/ods-cpp/12_1_Representing_Graph_Mat.html
  d3.graph.matrix = function(matrix) {
    var matrix = matrix ? matrix : [];
    
    var matrixObj = function(i,j) {
      return matrix[i][j];
    };

    matrixObj.description = function() {
      return "A " + matrix.length +
             " by " + matrix.length +
             " adjacency matrix";
    };

    matrixObj.data = matrixObj.matrix = function(x) {
      if (!arguments.length) return matrix;
      matrix = x;
      return this;
    };

    matrixObj.set = matrixObj.addEdge = function(i,j,value) {
      matrix[i][j] = value ? value : 1;
      return this;
    };

    matrixObj.remove = matrixObj.removeEdge = function(i,j) {
      matrix[i][j] = 0;
      return this;
    };

    matrixObj.has = matrixObj.hasEdge = function(i,j) {
      return !!matrix[i][j];
    };

    matrixObj.outE = matrixObj.outEdges = function(i) {
      var edges = [],
          n = matrix.length;
      var j = -1; while (++j < n) {
        if (matrix[i][j]) edges.push(j);
      }
      return edges;
    };

    matrixObj.inE =  matrixObj.inEdges = function(i) {
      var edges = [],
          n = matrix.length;
      var j = -1; while (++j < n) {
        if (matrix[j][i]) edges.push(j);
      }
      return edges;
    };

    return matrixObj;
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
    }
    
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

    return links;
  };


})(d3);
