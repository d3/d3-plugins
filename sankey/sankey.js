d3.sankey = function() {
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      links = [];

  sankey.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function(iterations) {
    computeNodeLinks();
    computeNodeValues();
    // use posX /posY if specified in node definition.
    // posX /posY needs to be specified for all nodes, but is only checked in first).
    if ("posX" in nodes[1]) {setNodeBreadths();} else {computeNodeBreadths();}; 
    computeNodeDepths(iterations); 
    computeLinkDepths();
    return sankey;
  };

  sankey.relayout = function() {
    computeLinkDepths();
    return sankey;
  };

  sankey.link = function() {
    var curvature = .5;

    // Determine the link x,y values. 
    // Links are made up of 2 small straight elements at beginning and end 
    // with a curved element in between.
    // (x0,y0), (x5,y5) are the start/end points of the links 
    // (x1,y1), (x4,y4) change between straight and curved elements
    // (x2,y2), (x3,y3) curve helper points
    // Nodes with the attribute vertical have vertical incoming links,
    // either from the top or bottom, depending on deltaY.
    function link(d) {
      if (d.target.vertical) {
        var x0 = d.source.x + d.source.dx,
          x1 = x0 + d.source.dx,
          x5 = d.target.x + d.dy/2,
          x4 = x5,
          xi = d3.interpolateNumber(x1, x4), 
          x2 = Math.max(xi(curvature), x1+d.dy),
          x3 = x5,
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = y0,
          y5 = d.target.y + d.ty + d.dy / 2,
          y4,
          deltaY = y5-y0,
          y2 = y0;
        if (deltaY > 0) { 
          y5 = d.target.y; 
          y4 = y5 - d.target.dx; 
          } 
        else { 
          y5 = d.target.y + d.source.dx; 
          y4 = y5 + d.target.dx; 
          };
        var yi = d3.interpolateNumber(y1, y4);
        if (deltaY > 0) {
            y3 = Math.min(yi(curvature), y4-2*d.dy);
          }
        else {
            y3 = Math.max(yi(curvature), y4+2*d.dy);
          };
      }
      
      else {
        var x0 = d.source.x + d.source.dx,
          x1 = x0 + d.source.dx,
          x5 = d.target.x,
          x4 = x5 - d.target.dx,
          xi = d3.interpolateNumber(x1, x4), 
          x2 = Math.max(xi(curvature), x1+2*d.dy),
          x3 = Math.min(xi(curvature), x4-2*d.dy),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = y0,
          y5 = d.target.y + d.ty + d.dy / 2,
          y4 = y5,
          y2 = y0,
          y3 = y5;
      }
          
      return "M" + x0 + "," + y0
           + "L" + x1 + "," + y1
           + "C" + x2 + "," + y2
           + " " + x3 + "," + y3
           + " " + x4 + "," + y4
           + "L" + x5 + "," + y5;
    };

    link.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function(node) {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  // Set breadth (x-position) for each node, if given in data.
  function setNodeBreadths() {
      var posXlist = []
      nodes.forEach(function(node) {
          node.x = node.posX;
          node.dx = nodeWidth;
          posXlist.push(node.posX);
      });
      scaleNodeBreadths((size[0] - nodeWidth) / Math.max.apply(null, posXlist)); 
      };
      
  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth, except 
  // nodes with the vertical attribute, which are moved to the incoming neighbor plus 0.5
  function computeNodeBreadths() {
    var remainingNodes = nodes,
        nextNodes,
        x = 0;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach(function(node) {
        node.x = x;
        node.dx = nodeWidth;
        node.sourceLinks.forEach(function(link) {
          if (nextNodes.indexOf(link.target) < 0) {
            nextNodes.push(link.target);
          }
        });
      });
      remainingNodes = nextNodes;
      ++x;
    }

    //
    moveSinksRight(x);
    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  function moveSourcesRight() {
    nodes.forEach(function(node) {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      }
    });
  }

  function moveSinksRight(x) {
    nodes.forEach(function(node) {
      if (!node.sourceLinks.length) {
          if (node.vertical) { node.x = node.x -0.5;}
          else { node.x = x - 1; }
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }
 
  // Iteratively assign the depth (y-position) for each node
  // Nodes with the vertical attribute are moved to the bottom
  function computeNodeDepths(iterations) {
    var nodesByBreadth = d3.nest()
        .key(function(d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });
     
    initializeNodeDepth();
      
    if (!("posY" in nodes[1])) {
      resolveCollisions();
      for (var alpha = 1; iterations > 0; --iterations) {
        relaxRightToLeft(alpha *= .99);
        resolveCollisions();
        relaxLeftToRight(alpha);
        resolveCollisions();
      }
    moveVerticalDown();
    };
    
    function initializeNodeDepth() {
      var posYlist = [ ],
          maxPosY,
          ky = d3.min(nodesByBreadth, function(nodes) {
            return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
          });
          
      nodes.forEach(function(node) {
        posYlist.push(node.posY)
      });
      
      maxPosY = Math.max(Math.max.apply(null, posYlist), 1);
      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          if ("posY" in node) {
            node.y = node.posY / maxPosY * size[1];
          } 
          else {
            node.y = i; 
          };
          node.dy = node.value * ky;
        });
      });

      links.forEach(function(link) {
        link.dy = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach(function(nodes) {
        var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy;
          y0 = node.y + node.dy + nodePadding;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }
    
    function moveVerticalDown() {
      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          if ( node.vertical ) { node.y = size[1] - node.dy; };
        });
      });
    }
  }

  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  return sankey;
};
