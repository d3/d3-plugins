(function() {
  d3.forceLabels = function forceLabels() {
    var labelSim = d3.forceSimulation()

    // Update the position of the anchor based on the center of bounding box
    function updateAnchor() {
      if (!labelSim.selection) return;

      labelSim.selection.each(function(d) {
        var bbox = this.getBBox(),
            x = bbox.x + bbox.width/2,
            y = bbox.y + bbox.height/2

        d.anchorPos.x = x
        d.anchorPos.y = y

        // If a label position does not exist, set it to be the anchor position
        if (d.labelPos.x == null) {
          d.labelPos.x = x
          d.labelPos.y = y
        }
      })
    }

    // The anchor position should be updated on each tick
    labelSim.on("tick.labels", updateAnchor)

    // This updates all nodes/links - retaining any previous labelPos on updated nodes
    labelSim.update = function(selection) {
      labelSim.selection = selection
      var nodes = [], links = [];
      selection.nodes().forEach(function(d) {
        if (d && d.__data__) {
          var data = d.__data__

          if (!d.labelPos)  d.labelPos =  {fixed:false}
          if (!d.anchorPos) d.anchorPos = {fixed:true}

          // Place position objects in __data__ to make them available through
          // d.labelPos/d.anchorPos for different elements
          data.labelPos = d.labelPos
          data.anchorPos = d.anchorPos

          links.push({target:d.anchorPos, source:d.labelPos})
          nodes.push(d.anchorPos)
          nodes.push(d.labelPos)
        }
      })

      // Initialize simulation with nodes and some default forces (can be
      // changed later by user)
      labelSim
        .nodes(nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink()
          .links(links)
          .id(function id(d) { return d.id; })
          .distance(function id(link, i) { return 10; })
        )
      updateAnchor()
    }
    return labelSim
  }
})()
