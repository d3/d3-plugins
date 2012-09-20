# d3.cie

A plugin for CIE Lab and LCH color spaces. For an example, see

* http://bl.ocks.org/3014589

This plugin was incorporated into D3 2.10.0 on August 9, 2012 and can now be used directly as d3.hcl and d3.lab!

## Old Documentation

To create a Lab color, use the `d3.cie.lab` constructor. To create an LCH color, use the `d3.cie.lch` constructor. For example, here are two ugly colors:

```js
var green = d3.cie.lab(46.23, -51.70, 49.90),
    blue = d3.cie.lch(32.30, 133.81, -53.72);
```

To convert from RGB to Lab (or LCH), simply specify an RGB color to the constructor. You can use the same technique to convert from HSV; D3 first converts the HSV color to RGB, and then then d3.cie plugin converts from RGB to Lab or LCH. The following three statements are equivalent:

```js
var color = d3.cie.lab("#048F07");
var color = d3.cie.lab("rgb(4,143,7)");
var color = d3.cie.lab(d3.rgb(4, 143, 7));
```

To convert from Lab (or LCH) to RGB, simply stringify the color. For example, you can pass a Lab color to [selection.attr](/mbostock/d3/wiki/Selections#wiki-attr) and [selection.style](/mbostock/d3/wiki/Selections#wiki-attr):

```js
d3.select("body").style("background", d3.cie.lab(46.23, -51.70, 49.90));
```

The Lab and LCH color classes support custom [brighter](/mbostock/d3/wiki/Colors#wiki-rgb_brighter) and [darker](/mbostock/d3/wiki/Colors#wiki-rgb_brighter) implementations that only modify the L (*lightness*) channel. This tends to produce better results than the RGB or HSL equivalents.

The d3.cie plugin also lets you interpolates in Lab or LCH space. For example:

```js
var x = d3.scale.linear()
    .domain([0, 100])
    .range(["brown", "steelblue"])
    .interpolate(d3.cie.interpolateLab);
```

The d3.cie plugin does not support parsing CSS3-style color names for Lab and LCH, so you can't say `d3.rgb("lch(32, 133, -53")`; you must use the d3.cie.lab or d3.cie.lch constructors.

## Thank You

Various people contributed and helped in implementing this plugin.

* [Jeffery Heer](/jheer)
* [Justin Cormack](/justincormack)
* [Alex Gaynor](/alex)
* [Jacob Rus](/jrus)

If you like this, you might also like [Gregor Aisch](/gka)’s [Chroma.js](/gka/chroma.js).