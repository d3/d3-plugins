# Adjacency Matrix

[Demo](http://bl.ocks.org/emeeks/15c005cba60aad26e11a).

**#matrix.size** An array of [width, height] that is used to calculate grid x, y, height and width.

**#matrix.nodes** An array of the nodes of your network.

**#matrix.links** An array of the edges of your network. As with other D3 network layouts, if the source and target properties are numbers, they are assumed to be array position within the nodes array, otherwise objects are assumed.

**#matrix.edgeWeight** The function to return the weight of the edges of your links, if any. Defaults to returning 1.

**#matrix.nodeID** The function to return the id value of a node, defaults to returning #node.id. The id is used to build the matrix and drive the axes.

**#matrix.xAxis** Cannot be set. Call this from the same place where you've put your matrix cells and it will build a simple horizontal axis with labels from your node id.

**#matrix.yAxis** Cannot be set. Call this from the same place where you've put your matrix cells and it will build a simple vertical axis with labels from your node id.

**#matrix.directed** Set to false if you want to mirror undirected networks.

