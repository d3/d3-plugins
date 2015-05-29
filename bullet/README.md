# Bullet Chart

[Demo](http://bl.ocks.org/mbostock/4061961) and [vertical version](http://bl.ocks.org/jasondavies/5452290).

Designed by Stephen Few, a bullet chart “provides a rich display of data in a
small space.” A variation on a bar chart, bullet charts compare a given
quantitative measure (such as profit or revenue) against qualitative ranges
(e.g., poor, satisfactory, good) and related markers (e.g., the same measure a
year ago). Layout inspired by
[Stephen Few](http://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf).
Implementation based on work by
[Clint Ivy](http://projects.instantcognition.com/protovis/bulletchart/),
Jamie Love of [N-Squared Software](http://www.nsquaredsoftware.com/) and
[Jason Davies](http://www.jasondavies.com/).

##Documentation

A bullet chart consists of _ranges_, _markers_, and _measures_. A range
indicates the satisfaction of a measure and is shown as the background colors,
typically shades of gray. A marker indicates a target or previous value and is
shown as a vertical bar. A measure is the actual value being shown and is the
central bar, typically blue. Bullet charts also have an
[axis](https://github.com/mbostock/d3/wiki/SVG-Axes). Titles and subtitles are
not automatically generated.

Currently, the range of values must start at 0 and may not include negative numbers.

<a name="bullet" href="#bullet">#</a> d3.<b>bullet</b>()  
Create a new bullet chart.

<a name="_bullet" href="#_bullet">#</a> <b>bullet</b>(<i>selection</i>)  
Apply the axis to a selection or transition. The selection must contain an
`svg` or `g` element. Typically passed as the argument to
[selection.call](https://github.com/mbostock/d3/wiki/Selections#call).

<a name="orient" href="#orient">#</a> bullet.<b>orient</b>([<i>orientation</i>])  
Get or set the orientation of the bullet chart. The supported orientations are:
`"top"`, `"bottom"`, `"left"`, and `"right"`. The default orientation is `"left"`.

<a name="width" href="#width">#</a> bullet.<b>width</b>([<i>width</i>])  
<a name="height" href="#height">#</a> bullet.<b>height</b>([<i>height</i>])  
Get or set the width or height of the bullet chart, not including the axis.
Width and height are always horizontal and vertical, respectively, regardless
of _orient_. The default width is 380 and default height is 30.

<a name="ranges" href="#ranges">#</a> bullet.<b>ranges</b>([<i>ranges</i>])  
Get or set the ranges of the bullet chart. _ranges_ should be an array of
thresholds between ranges (the first range implicitly starts at 0), or a
function that returns the array. The function will be passed the current datum
`d` and the current index `i`, with the `this` context as the current DOM
element. The default is a function that returns `d.ranges`.

Ranges are rendered as `rect` elements with the `range` class and two others.
The index is given by `s0`, `s1`, and so on. `s0` is always the largest range
and has the lowest z-order. If there are three ranges, all three will have the
`t3` class, indicating the total number of ranges. This is useful for styling
bullet charts with varying numbers of ranges with different gradients.

Stephen Few recommends at most five ranges, and ideally three.

<a name="markers" href="#markers">#</a> bullet.<b>markers</b>([<i>markers</i>])  
Get or set the markers of the bullet chart. _markers_ should be an array of
marker values, or a function that returns the array. The function will be
passed the current datum `d` and the current index `i`, with the `this` context
as the current DOM element. The default is a function that returns `d.markers`.

Markers are rendered as `line` elements with the `marker` class and another
indicating the index in the original data: `s0`, `s1`, and so on.

Stephen Few suggests that multiple markers can be used to indicate the target
value and a prior comparable value, e.g. from last year. He advises against
more than two markers, and that one is usually sufficient.

<a name="measures" href="#measures">#</a> bullet.<b>measures</b>([<i>measures</i>])  
Get or set the measures of the bullet chart. _measures_ should be an array of
values, or a function that returns the array. The function will be passed the
current datum `d` and the current index `i`, with the `this` context as the
current DOM element. The default is a function that returns `d.measures`.

Measures are rendered as `rect` elements with the `measure` class and another
indicating the index: `s0`, `s1`, and so on. `s0` always corresponds to the
first measure in the original array, even though the bars will be z-ordered to
put the largest on the bottom.

The first measure is the primary datapoint displayed by the chart. Stephen Few
recommends a second measure for a forecasted value, if appropriate.
