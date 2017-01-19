(function() {
  d3.arcDiagram = function() {
    var sortNodes,
      sortLinks = arcDiagramSortLinks,
      linkLevel = arcDiagramLinkLevelCompact,
      nodeWidth = 0,
      separation = 1,
      nodeXOffset = 0,
      levelHeight = arcDiagramLevelHeight,
      nodes = [],
      links = [];

    function arc() {
      var levelIndex = d3.range(nodes.length).map(function() { return []; }),
        nw = typeof nodeWidth === "function" ? nodeWidth : function() { return nodeWidth; },
        sep = typeof separation === "function" ? separation : function() { return separation; },
        nxo = typeof nodeXOffset === "function" ? nodeXOffset : function() { return nodeXOffset; },
        lh = typeof levelHeight === "function" ? levelHeight : function() { return levelHeight; },
        curX = 0,
        nodeIndexMap, idx1, idx2;

      // node calculations
      nodes.forEach(function(n, i) { n.index = i; });
      // if sorting nodes, do it here and create a mapping from old to
      // new positions
      nodeIndexMap = {};
      if (sortNodes) nodes.sort(sortNodes);
      nodes.forEach(function(n, i) {
        nodeIndexMap[n.index] = i; n.index = i;
        // while we're iterating, we can set the x, dx, and y values
        n.x = curX + nxo(n);
        curX += nw(n) + sep(n);
        n.y = 0;
      });

      // link calculations
      // first, reassign source and index, if necessary.
      links.forEach(function(link) {
        link.source = nodeIndexMap[link.source] || link.source;
        link.target = nodeIndexMap[link.target] || link.target;
        // also set distance, which is useful for sorting.
        link.distance = Math.abs(link.source - link.target);
      });
      if (sortLinks) links.sort(sortLinks);

      // now we can find the level of each link
      links.forEach(function(link) {
        link.level = linkLevel(link, levelIndex);
        arcDiagramUpdateLevelIndex(link, levelIndex);
        // and while we're iterating, set the position values
        link.x1 = (nodes[link.source] || {}).x;
        link.x2 = (nodes[link.target] || {}).x;
        link.height = lh(link);
      });
    }

    arc.sortNodes = function(x) {
      if (!arguments.length) return sortNodes;
      sortNodes = x;
      return arc;
    }

    arc.sortLinks = function(x) {
      if (!arguments.length) return sortLinks;
      sortLinks = x;
      return arc;
    }

    arc.linkLevel = function(x) {
      if (!arguments.length) return linkLevel;
      if (x.toLowerCase() == "compact")
        linkLevel = arcDiagramLinkLevelCompact;
      else if (x.toLowerCase() == "distance")
        linkLevel = arcDiagramLinkLevelDistance;
      else
        linkLevel = x;
      return arc;
    }

    arc.nodeWidth = function(x) {
      if (!arguments.length) return nodeWidth;
      nodeWidth = typeof x === "function" ? x : +x;
      return arc;
    }

    arc.separation = function(x) {
      if (!arguments.length) return separation;
      separation = typeof x === "function" ? x : +x;
      return arc;
    }

    arc.nodeXOffset = function(x) {
      if (!arguments.length) return nodeXOffset;
      nodeXOffset = typeof x === "function" ? x : +x;
      return arc;
    }

    arc.levelHeight = function(x) {
      if (!arguments.length) return levelHeight;
      levelHeight = typeof x === "function" ? x : +x;
      return arc;
    }

    arc.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return arc;
    }

    arc.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return arc;
    }

    return arc;
  }

  function arcDiagramSortLinks(a, b) { return a.distance - b.distance; }

  function arcDiagramLinkLevelCompact(link, levelIndex) {
    var level = 1, idx1, idx2;

    if (link.source <= link.target) {
      idx1 = link.source; idx2 = link.target;
    } else {
      idx1 = link.target; idx2 = link.source;
    }

    for (var i = idx1; i < idx2; i++) {
      if (levelIndex[i][level]) {
        level += 1;
        i = idx1 - 1;  // restart the for-loop
        continue;
      }
    }
    return level;
  }

  function arcDiagramLinkLevelDistance(link, levelIndex) {
    return link.distance;
  }

  function arcDiagramLevelHeight(link) {
    return link.level;
  }

  function arcDiagramUpdateLevelIndex(link, levelIndex) {
    var idx1, idx2;
    if (link.source <= link.target) {
      idx1 = link.source; idx2 = link.target;
    } else {
      idx1 = link.target; idx2 = link.source;
    }
    d3.range(idx1, idx2).forEach(function(i) { levelIndex[i][link.level] = true; });
  }
})();
