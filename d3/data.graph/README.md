# d3.data.graph

A plugin for manipulating graph data structures.

```js
  var graph = d3.data.graph();
```
Currently can convert from a matrix

```js
  graph.matrix([
    [0,1,0],
    [1,0,0],
    [1,1,1]
  ]);
```

To a list of links

```js
  graph.links();
  /*
  [
    {"source":0,"target":0,"value":0},{"source":0,"target":1,"value":1},{"source":0,"target":2,"value":0},
    {"source":1,"target":0,"value":1},{"source":1,"target":1,"value":0},{"source":1,"target":2,"value":0},
    {"source":2,"target":0,"value":1},{"source":2,"target":1,"value":1},{"source":2,"target":2,"value":1}
  ]
  */
```

Or back to a matrix

```js
  graph.matrix();
  /*
    [0,1,0],
    [1,0,0],
    [1,1,1]
  */
```

Nodes are accessible as well

```js
  graph.nodes(['red', 'purple', 'orange']);
```

Human readable description

```js
  graph.description();
  // "d3.data.graph with 3 nodes and 9 links"
```

Basic query filters. These currently filter the original node/link sets, so subsequent filters won't stack. Eventually this should be powered by a selection mechanism similar to [Gremlin](https://github.com/tinkerpop/gremlin/wiki/Basic-Graph-Traversals).

```js
  g.filter('nodes', function(d) { return d.indexOf('urple') > -1 }).value();
  // { nodes: ["purple"] }

  g.filter('links', function(d) { return d.source > 1 }).value()
  // {"links":[{"source":2,"target":0,"value":1},{"source":2,"target":1,"value":1},{"source":2,"target":2,"value":1}]}
```
