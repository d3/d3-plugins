# Interpolate Zoom

**As of [D3 3.3](https://github.com/mbostock/d3/releases/tag/v3.3.0), the zoom interpolator is now part of D3 core and this plugin is deprecated.**

An interpolator for zooming and panning between two views of a two-dimensional plane, based on [“Smooth and efficient zooming and panning”](https://www.google.com/search?q=Smooth+and+efficient+zooming+and+panning) by Jarke J. van Wijk and Wim A.A. Nuij.

Demo: <http://bl.ocks.org/3828981>

To use this plugin:

```html
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="http://d3js.org/d3.interpolate-zoom.v0.min.js" charset="utf-8"></script>
```

Note that since this script uses UTF-8 characters, the `charset` attribute is required if the page does not have a `<meta charset="utf-8">` in the head. There’s also a [d3.interpolate-zoom.v0.js](http://d3js.org/d3.interpolate-zoom.v0.js) for development, or you can clone this repository.

<a name="interpolateZoom" href="#interpolateZoom">#</a> d3.<b>interpolateZoom</b>(<i>start</i>, <i>end</i>)

Returns an [interpolator](https://github.com/mbostock/d3/wiki/Transitions#wiki-_interpolate) between the two points *start* and *end*. Each point should be defined as an array of three numbers in world coordinates: *ux*, *uy* and *w*. The first two coordinates *ux*, *uy* are the center of the viewport. The last coordinate *w* is the size of the viewport.

The returned interpolator also has a *duration* property which encodes the recommended transition duration in milliseconds. This duration is based on the path length of the curved trajectory through *u,w* space. If you want to a slower or faster transition, feel free to multiply this by an arbitrary scale factor (<i>V</i> as described in the original paper).
