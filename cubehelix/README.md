An interpolator that implements Dave Green’s [cubehelix color scheme](http://www.mrao.cam.ac.uk/~dag/CUBEHELIX/).

See [bl.ocks.org/11413789](http://bl.ocks.org/mbostock/11413789) and [bl.ocks.org/11415064](http://bl.ocks.org/mbostock/11415064) for examples.

<a href="#interpolateCubehelix" name="interpolateCubehelix">#</a> d3.<b>interpolateCubehelix</b>(<i>a</i>, <i>b</i>)

Returns a cubehelix <a href="https://github.com/mbostock/d3/wiki/Transitions#_interpolate">interpolator</a> between the two colors <i>a</i> and <i>b</i>, using a gamma correction value of 1. The two colors are typically specified in HSL color space. For example, the default cubehelix color scheme is:

```js
var cubehelix = d3.interpolateCubehelix("hsl(300,50%,0%)", "hsl(-240,50%,100%)");
```

The hue of color <i>a</i> determines the starting hue angle in degrees, while the hue of color <i>b</i> determines the ending hue angle in degrees; the hue angle is interpolated linearly for intermediate values. Likewise for saturation and lightness, which are specified in percentages. (The [d3.hsl](https://github.com/mbostock/d3/wiki/Colors#d3_hsl) constructor can also be used.)

If either color <i>a</i> or <i>b</i> is not an HSL color, the colors are converted to HSL color space first. However, it is recommended that you specify each color’s hue, saturation and lightness explicitly: cubehelix interpolation does not actually use the HSL color space, and thus the terms <i>hue</i>, <i>saturation</i> and <i>lightness</i> here are similar but slightly different to their meaning in HSL color space.

The return value of the interpolator is a hexadecimal RGB string.

To convert from the original color scheme’s <i>START</i>, <i>ROTS</i> and <i>HUE</i> parameters, use the following equalities:

   * starting hue angle = (<i>START</i> - 1) * 120
   * ending hue angle = (<i>START</i> - 1) * 120 + <i>ROTS</i> * 360
   * saturation = <i>HUE</i> / 2

For example, the default color scheme’s settings are:

   * <i>START</i> = 0.5
   * <i>ROTS</i> = -1.5
   * <i>HUE</i> = 1.0

These correspond to the following start and end colors:

   * hsl(300, 50%, 0%)
   * hsl(-240, 50%, 100%)

While the original cubehelix color scheme always uses the full range of lightness from 0% to 100%, note that it is possible in this interpolator to use a subset of this range by specifying start and end colors with different lightnesses.

<a href="#interpolateCubehelix_gamma" name="interpolateCubehelix_gamma">#</a> d3.interpolateCubehelix.<b>gamma</b>(<i>gamma</i>)

Returns a cubehelix interpolator factory with the specified <i>gamma</i> correction value. For example, to create the default cubehelix color scheme with a gamma correction value of 1.2:

```js
var cubehelix = d3.interpolateCubehelix.gamma(1.2)("hsl(300,50%,0%)", "hsl(-240,50%,100%)");
```

<a href="#cubehelix" name="cubehelix">#</a> d3.scale.<b>cubehelix</b>

Constructs a new [linear scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales) with the interpolator [d3.interpolateCubehelix](#interpolateCubehelix), the domain [0, 1] and the range [hsl(300°, 50%, 0%), hsl(-240°, 50%, 100%)]. This is merely a convenience function.
