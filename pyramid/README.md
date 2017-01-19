# Pyramid Chart Layout built in d3.js

Demo: <http://bl.ocks.org/ronakrrb/73e9204a66e2a9c1fee8>

```js
var pyramid = d3.pyramid()
    .size([width,height])
    .value(function(d) { return d.value; });
```

```
var g = d3.selectAll(".pyramid-group")
    .data(pyramid(data))
    .enter().append("g")
    .attr("class", "pyramid-group");
```
