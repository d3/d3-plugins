# D3 Force Labels

Demo: <https://bl.ocks.org/TylerRick/c5df6e777a9de71777b4c4b449abfae8>

Generates an automatic and dynamic positioning for labels, using the d3 force layout.   Once a ```forceLabels``` object has been created, simply call the bound function ```update``` with a selection of the objects you want to attach labels to as an argument.

`forceLabels()` returns a [`d3.forceSimulation()`](https://github.com/d3/d3-force/blob/master/README.md#forceSimulation) object which allows full control over the charge strength, etc.

For example, to change the charge strength, you could do something like this:
```
labelSim.force('charge').strength(-60);
```

At each tick the following occurs:

  - Center of each object (anchor position) is determined by the SVG Bounding Box of that object and stored in object ```anchorPos``` under x,y
  - The position of the label element is determined by a force layout where anchors are fixed nodes and labels are floating.  New position for each label is stored in object ```labelPos``` under x,y

Both the ```anchorPos``` and ```labelPos``` are inserted in the ```__data__``` variable of the object being labeled.  This allows easy access when drawing the labels and connectors.

In the demo the label and link are created as svg objects on the same data selection as the anchors.  As the position information is embedded in ```__data__```, the redraw function is simply:

```js
function redrawLabels() {
  labelBox
    .attr("transform", function(d) {
      return "translate(" + d.labelPos.x + " " + d.labelPos.y + ")"
    })

  links
    .attr("x1", function(d) { return d.anchorPos.x })
    .attr("y1", function(d) { return d.anchorPos.y })
    .attr("x2", function(d) { return d.labelPos.x })
    .attr("y2", function(d) { return d.labelPos.y })
}
```

which is attached like this:
```js
labelSim = d3.forceLabels()
  .on("tick", redrawLabels)
```

## Authors

- <https://github.com/ZJONSSON>
- <https://github.com/TylerRick>
