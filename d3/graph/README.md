# d3.graph

A plugin for manipulating [graph data structures](http://opendatastructures.org/versions/edition-0.1d/ods-java/node59.html).

## Basics

Convert [matrix](http://en.wikipedia.org/wiki/Adjacency_matrix) to list

```js
d3.graph.toList.matrix([
  [0,1,0],
  [1,0,0],
  [1,1,1]
])
/*
[
  {"source":0,"target":0,"value":0},{"source":0,"target":1,"value":1},{"source":0,"target":2,"value":0},
  {"source":1,"target":0,"value":1},{"source":1,"target":1,"value":0},{"source":1,"target":2,"value":0},
  {"source":2,"target":0,"value":1},{"source":2,"target":1,"value":1},{"source":2,"target":2,"value":1}
]
*/
```

Convert list to matrix

```js
d3.graph.fromList.matrix([
{"source":0,"target":1,"value":1},
  {"source":1,"target":0,"value":1},
  {"source":2,"target":0,"value":1},
  {"source":2,"target":1,"value":1},
  {"source":2,"target":2,"value":1}
])
/*
  [0,1,0],
  [1,0,0],
  [1,1,1]
*/
```

## Stateful Use

```js
var graph = d3.graph();
```

Load a matrix

```js
graph.matrix([
  [0,1,0],
  [1,0,0],
  [1,1,1]
]);
```

Get the graph as list of links

```js
graph.links();
```

Get the graph as matrix

```js
graph.matrix();
```

Nodes and links can be modified by passing in a value. This will overwrite existing data.

```js
graph.nodes(['red', 'purple', 'orange']);
graph.links([{"source":0,"target":0,"value":0},{"source":0,"target":1,"value":1},{"source":0,"target":2,"value":0}]);
```

Get a description of the graph

```js
graph.description();
// "d3.graph with 3 nodes and 9 links"
```

Basic node filters. These currently filter the original node set, so subsequent filters won't stack. See [Gremlin](https://github.com/tinkerpop/gremlin/wiki/Basic-Graph-Traversals).

```js
graph.traverse().filter(function(d) { return d.indexOf('urp') > -1 }).value();
```
