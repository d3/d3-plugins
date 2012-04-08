# d3.graph

A plugin for manipulating graph data structures.

```
  var graph = d3.data.graph();
```

Currently can convert from a matrix:

```js
  graph.matrix([
    [0,1,0],
    [1,0,0],
    [1,1,1]
  ]);
```

To a list of links:

```js
  graph.links();
```

Or back to a matrix:

```js
  graph.matrix();
```

Nodes are accessible , but do not currently respond to matrix input:

```js
  graph.nodes(['red', 'purple', 'orange']);
```

