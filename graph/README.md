# d3.graph

This plugin is not currently in active development.

For a more complete set of graph analysis tools, see the work of [Elijah Meeks and Maya Krishnan](http://dhs.stanford.edu/dh/networks/).

A plugin for manipulating [graph data structures](http://opendatastructures.org/ods-cpp/12_Graphs.html).


## Todo

* link nodes by name. see this [discussion on the force layout](https://groups.google.com/forum/?fromgroups#!topic/d3-js/LWuhBeEipz4)

* adjacency list
* graph traversal
* hypergraph

## Matrix

Create a matrix

```js
  var matrix = d3.graph.matrix([
    [1,1,0],
    [0,0,0],
    [2,1,1]
  ]);
```

Get an edge value

```js
matrix(i,j)
```

Check if edge exists (non-zero)

```js
matrix.has(i,j)
```

Set an edge value

```js
matrix.set(i,j,value)
```

Remove an edge

```js
matrix.remove(i,j)
```

Get outgoing edge indices

```js
matrix.outE(i)
```

Get incoming edge indices

```js
matrix.inE(i)
```

### todo

* documentation
* changing size

## Basics

Convert [matrix](http://en.wikipedia.org/wiki/Adjacency_matrix) to [list](http://opendatastructures.org/ods-cpp/12_2_Graph_as_Collection_Li.html)

```js
d3.graph.matrixToList([
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
d3.graph.listToMatrix([
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
