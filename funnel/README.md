# Funnel Chart Layout built in d3.js

Demo: <http://bl.ocks.org/ronakrrb/e8d3e6644e2acaf1d3b2>

```js
var funnel = d3.funnel()
    .size([width,height])
    .mouth([width,height]) // width and height of the rectangle in the funnel
    .value(function(d) { return d.value; });
```

```
var g = d3.selectAll(".funnel-group")
    .data(funnel(data))
    .enter().append("g")
    .attr("class", "funnel-group");
```
