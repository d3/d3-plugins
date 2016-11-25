# Sankey Diagrams

## Demo

- <http://bost.ocks.org/mike/sankey/>
- see demo.html


## Basic usage

Expected data (format): arrays of nodes and links.

```js
// Array of node objects (e.g. with a 'name' field here):
var nodes = [
    {name: "a"},
    {name: "b"},
    // ...
];
// Array of links between the nodes:
// objects with 'source', 'target' node indices and a 'value' for the link weight:
var links = [
    {source: 0, target: 1, value: 10.2},
    {source: 0, target: 2, value: 5.4}
    // ...
];
```

Configure the Sankey object and get a path data generator.

```js
var sankey = d3.sankey()
    .size([width, height])
    .nodeWidth(15)
    .nodePadding(10)
    .nodes(nodes)
    .links(links)
    .layout(32);

var path = sankey.link();
```

Draw links and nodes, the bare essence:

```js
// Draw links (as svg paths)
root.selectAll('.link')
    .data(links)
    .enter().append('path')
    .attr('class', 'link')
    .attr('d', path)
    .style("stroke-width", function (d) { return Math.max(1, d.dy); })
    // ...

// Draw nodes
root.selectAll('.node')
    .data(nodes)
    .enter().append('rect')
    .attr({
        'class': 'node',
        x: function (d) { return d.x },
        y: function (d) { return d.y },
        height: function (d) { return d.dy; },
        width: sankey.nodeWidth()
    })
    // ...
```
