# Sankey Diagrams

Demo: <http://bost.ocks.org/mike/sankey/>

```js
var sankey = d3.sankey()
    .size([width, height])
    .nodeWidth(15)
    .nodePadding(10)
    .nodes(energy.nodes)
    .links(energy.links)
    .overlapLinksAtSources(false)
    .overlapLinksAtTargets(false)
    .minValue(1)
    .layout(32);
```

```
var path = sankey.link();
```
