# d3.cie

A plugin for CIE L\*a\*b\* and L\*c\*h\* color spaces.

To create a L\*a\*b\* color, use the `d3.cie.lab` constructor:

```js
var green = d3.cie.lab(46.23, -51.70, 49.90),
    blue = d3.cie.lch(32.30, 133.81, -53.72);
```

Likewise, to convert from RGB to L\*a\*b\* or L\*c\*h\*, simply specify an RGB
color. These are all equivalent:

```js
var color = d3.cie.lab("#048F07");
var color = d3.cie.lab("rgb(4,143,7)");
var color = d3.cie.lab(d3.rgb(4, 143, 7));
```

To convert back to RGB, you can simply toString the object; thus, it is suitable
for us in conjunction with selection.attr and selection.style:

```js
d3.select("body")
    .style("background", d3.cie.lab(51.48, -55.52, 52.88));
```

This plugin also lets you interpolates in L\*a\*b\* or L\*c\*h\* space. For
example:

```js
var x = d3.scale.linear()
    .domain([0, 100])
    .range(["brown", "steelblue"])
    .interpolate(d3.cie.interpolateLab);
```

## Thank You

Various people contributed and helped in implementing this plugin.

* [Jeffery Heer](/jheer)
* [Justin Cormack](/justincormack)
* [Alex Gaynor](/alex)
* [Jacob Rus](/jrus)

If you like this, you might also like [Gregor Aisch](/gka)’s [Chroma.js](/gka/chroma.js).