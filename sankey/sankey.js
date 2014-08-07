d3.sankey = function() {
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      links = [],
      components = [];

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

    computeNodeStructure();
    computeNodeBreadths();

    computeNodeDepths(iterations);
    computeLinkDepths();
    
    return sankey;
  };

  sankey.relayout = function() {
    computeLinkDepths();
    return sankey;
  };

  // A more involved path generator that requires 3 elements to render -- 
  // It draws a starting element, intermediate and end element that are useful
  // while drawing reverse links to get an appropriate fill.
  //
  // Each link is now an area and not a basic spline and no longer guarantees
  // fixed width throughout.
  //
  // Sample usage:
  //
  //  linkNodes = this._svg.append("g").selectAll(".link")
  //      .data(this.links)
  //    .enter().append("g")
  //      .attr("fill", "none")
  //      .attr("class", ".link")
  //      .sort(function(a, b) { return b.dy - a.dy; });
  //
  //  linkNodePieces = [];
  //  for (var i = 0; i < 3; i++) {
  //    linkNodePieces[i] = linkNodes.append("path")
  //      .attr("class", ".linkPiece")
  //      .attr("d", path(i))
  //      .attr("fill", ...)
  //  }
  sankey.reversibleLink = function() {
    var curvature = .5;

    // Used when source is behind target, the first and last paths are simple
    // lines at the start and end node while the second path is the spline
    function forwardLink(part, d) {
      var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy,
          y1 = d.target.y + d.ty,
          y2 = d.source.y + d.sy + d.dy,
          y3 = d.target.y + d.ty + d.dy;

      switch (part) {
        case 0:
          return "M" + x0 + "," + y0 + "L" + x0 + "," + (y0 + d.dy);

        case 1:
          return "M" + x0 + "," + y0
               + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1
               + "L" + x1 + "," + y3
               + "C" + x3 + "," + y3 + " " + x2 + "," + y2 + " " + x0 + "," + y2
               + "Z";
      
        case 2:
          return "M" + x1 + "," + y1 + "L" + x1 + "," + (y1 + d.dy);
      }
    }

    // Used for self loops and when the source is actually in front of the 
    // target; the first element is a turning path from the source to the 
    // destination, the second element connects the two twists and the last 
    // twists into the target element.
    //
    // 
    //  /--Target
    //  \----------------------\
    //                 Source--/
    //
    function backwardLink(part, d) {
      var curveExtension = 30;
      var curveDepth = 15;

      function getDir(d) {
        return d.source.y + d.sy > d.target.y + d.ty ? -1 : 1;
      }

      function p(x, y) {
        return x + "," + y + " ";
      }

      var dt = getDir(d) * curveDepth,
          x0 = d.source.x + d.source.dx,
          y0 = d.source.y + d.sy,
          x1 = d.target.x,
          y1 = d.target.y + d.ty;

      switch (part) {
        case 0:
          return "M" + p(x0, y0) + 
                 "C" + p(x0, y0) +
                       p(x0 + curveExtension, y0) +
                       p(x0 + curveExtension, y0 + dt) +
                 "L" + p(x0 + curveExtension, y0 + dt + d.dy) +
                 "C" + p(x0 + curveExtension, y0 + d.dy) +
                       p(x0, y0 + d.dy) +
                       p(x0, y0 + d.dy) +
                 "Z";
        case 1:
          return "M" + p(x0 + curveExtension, y0 + dt) + 
                 "C" + p(x0 + curveExtension, y0 + 3 * dt) +
                       p(x1 - curveExtension, y1 - 3 * dt) +
                       p(x1 - curveExtension, y1 - dt) +
                 "L" + p(x1 - curveExtension, y1 - dt + d.dy) +
                 "C" + p(x1 - curveExtension, y1 - 3 * dt + d.dy) +
                       p(x0 + curveExtension, y0 + 3 * dt + d.dy) +
                       p(x0 + curveExtension, y0 + dt + d.dy) +
                 "Z";

        case 2:
          return "M" + p(x1 - curveExtension, y1 - dt) + 
                 "C" + p(x1 - curveExtension, y1) +
                       p(x1, y1) +
                       p(x1, y1) +
                 "L" + p(x1, y1 + d.dy) +
                 "C" + p(x1, y1 + d.dy) +
                       p(x1 - curveExtension, y1 + d.dy) +
                       p(x1 - curveExtension, y1 + d.dy - dt) +
                 "Z";
      }
    }

    return function(part) {
      return function(d) {
        if (d.source.x < d.target.x) {
          return forwardLink(part, d);
        } else {
          return backwardLink(part, d);
        }
      }
    }
  };

  // The standard link path using a constant width spline that needs a 
  // single path element.
  sankey.link = function() {
    var curvature = .5;

    function link(d) {
      var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
      return "M" + x0 + "," + y0
           + "C" + x2 + "," + y0
           + " " + x3 + "," + y1
           + " " + x1 + "," + y1;
    }

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

  // Take the list of nodes and create a DAG of supervertices, each consisting 
  // of a strongly connected component of the graph
  //
  // Based off:
  // http://en.wikipedia.org/wiki/Tarjan's_strongly_connected_components_algorithm
  function computeNodeStructure() {
    var nodeStack = [], 
        index = 0;

    nodes.forEach(function(node) {
      if (!node.index) {
        connect(node);
      }
    });

    function connect(node) {
      node.index = index++;
      node.lowIndex = node.index;
      node.onStack = true;
      nodeStack.push(node);

      if (node.sourceLinks) {
        node.sourceLinks.forEach(function(sourceLink){
          var target = sourceLink.target;
          if (!target.hasOwnProperty('index')) {
            connect(target);
            node.lowIndex = Math.min(node.lowIndex, target.lowIndex);
          } else if (target.onStack) {
            node.lowIndex = Math.min(node.lowIndex, target.index);
          }
        });

        if (node.lowIndex === node.index) {
          var component = [], currentNode;
          do { 
            currentNode = nodeStack.pop()
            currentNode.onStack = false;
            component.push(currentNode);
          } while (currentNode != node);
          components.push({
            root: node,
            scc: component
          });
        }
      }
    }

    components.forEach(function(component, i){
      component.index = i;
      component.scc.forEach(function(node) {
        node.component = i;
      });
    });
  }

  // Assign the breadth (x-position) for each strongly connected component,
  // followed by assigning breadth within the component.
  function computeNodeBreadths() {
    
    layerComponents();

    components.forEach(function(component, i){
      bfs(component.root, function(node){
        var result = node.sourceLinks
          .filter(function(sourceLink){
            return sourceLink.target.component == i;
          })
          .map(function(sourceLink){
            return sourceLink.target;
          });
        return result;
      });
    });

    var max = 0;
    var componentsByBreadth = d3.nest()
      .key(function(d) { return d.x; })
      .sortKeys(d3.ascending)
      .entries(components)
      .map(function(d) { return d.values; });

    var max = -1, nextMax = -1;
    componentsByBreadth.forEach(function(c){
      c.forEach(function(component){
        component.x = max + 1;
        component.scc.forEach(function(node){
          node.x = component.x + node.x;
          nextMax = Math.max(nextMax, node.x);
        });
      });
      max = nextMax;
    });

    
    nodes
      .filter(function(node) {
        var outLinks = node.sourceLinks.filter(function(link){ return link.source.name != link.target.name; });
        return (outLinks.length == 0);
      })
      .forEach(function(node) { node.x = max; })

    scaleNodeBreadths((size[0] - nodeWidth) / Math.max(max, 1));

    function flatten(a) {
      return [].concat.apply([], a);
    }

    function layerComponents() {
      var remainingComponents = components,
          nextComponents,
          visitedIndex,
          x = 0;

      while (remainingComponents.length) {
        nextComponents = [];
        visitedIndex = {};

        remainingComponents.forEach(function(component) {
          component.x = x;

          component.scc.forEach(function(n) {
            n.sourceLinks.forEach(function(l) {
              if (!visitedIndex.hasOwnProperty(l.target.component) &&
                   l.target.component != component.index) {
                nextComponents.push(components[l.target.component]);
                visitedIndex[l.target.component] = true;
              }
            })
          });
        });

        remainingComponents = nextComponents;
        ++x;
      }
    }

    function bfs(node, extractTargets) {
      var queue = [node], currentCount = 1, nextCount = 0;
      var x = 0;

      while(currentCount > 0) {
        var currentNode = queue.shift();
        currentCount--;

        if (!currentNode.hasOwnProperty('x')) {
          currentNode.x = x;
          currentNode.dx = nodeWidth;

          var targets = extractTargets(currentNode);

          queue = queue.concat(targets);
          nextCount += targets.length;
        }


        if (currentCount == 0) { // level change
          x++;
          currentCount = nextCount;
          nextCount = 0;
        }

      }
    }
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
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }

  function computeNodeDepths(iterations) {
    var nodesByBreadth = d3.nest()
        .key(function(d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });

    //
    initializeNodeDepth();
    resolveCollisions();
    for (var alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= .99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeDepth() {
      var ky = d3.min(nodesByBreadth, function(nodes) {
        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
      });

      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          node.y = i;
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
