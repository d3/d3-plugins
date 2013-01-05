# Extended Geographic Projections

Projections:

* [d3.geo.aitoff](http://bl.ocks.org/3682698) - Aitoff
* [d3.geo.albers](http://bl.ocks.org/3734308) - Albers equal-area conic
* [d3.geo.armadillo](http://bl.ocks.org/4463127) - Armadillo
* [d3.geo.august](http://bl.ocks.org/3797581) - August conformal
* [d3.geo.azimuthalEqualArea](http://bl.ocks.org/3757101) - Lambert azimuthal equal-area
* [d3.geo.azimuthalEquidistant](http://bl.ocks.org/3757110) - Azimuthal equidistant
* [d3.geo.berghaus](http://bl.ocks.org/4463049) - Berghaus Star
* [d3.geo.bonne](http://bl.ocks.org/3734313) - Bonne
* [d3.geo.collignon](http://bl.ocks.org/3734316) - Collignon
* [d3.geo.conicConformal](http://bl.ocks.org/3734321) - Lambert conformal conic
* [d3.geo.conicEquidistant](http://bl.ocks.org/3734317) - Conic equidistant
* [d3.geo.craig](http://bl.ocks.org/4459466) - Craig Retroazimuthal
* [d3.geo.cylindricalEqualArea](http://bl.ocks.org/3712408) - Cylindrical equal-area
* [d3.geo.eckert1](http://bl.ocks.org/3734322) - Eckert I
* [d3.geo.eckert2](http://bl.ocks.org/3734324) - Eckert II
* [d3.geo.eckert3](http://bl.ocks.org/3734325) - Eckert III
* [d3.geo.eckert4](http://bl.ocks.org/3734327) - Eckert IV
* [d3.geo.eckert5](http://bl.ocks.org/3734328) - Eckert V
* [d3.geo.eckert6](http://bl.ocks.org/3734329) - Eckert VI
* [d3.geo.eisenlohr](http://bl.ocks.org/3797585) - Eisenlohr conformal
* [d3.geo.equirectangular](http://bl.ocks.org/3757119) - Equirectangular (Plate Carrée)
* [d3.geo.gnomonic](http://bl.ocks.org/3757349) - Gnomonic
* [d3.geo.gringorten](http://bl.ocks.org/3796882) - Gringorten
* [d3.geo.guyou](http://bl.ocks.org/3763867) - Guyou hemisphere-in-a-square
* [d3.geo.hammer](http://bl.ocks.org/3712397) - Hammer
* [d3.geo.hammerRetroazimuthal](http://bl.ocks.org/4459130) - Hammer Retroazimuthal
* [d3.geo.healpix](http://bl.ocks.org/4463237) - HEALPix
* [d3.geo.homolosine](http://bl.ocks.org/3734330) - Goode homolosine
* [d3.geo.kavrayskiy7](http://bl.ocks.org/3710082) - Kavrayskiy VII
* [d3.geo.lagrange](http://bl.ocks.org/3797591) - Lagrange conformal
* [d3.geo.larrivee](http://bl.ocks.org/3719042) - Larrivée
* [d3.geo.littrow](http://bl.ocks.org/4459071) - Littrow
* [d3.geo.loximuthal](http://bl.ocks.org/3867220) - Loximuthal
* [d3.geo.mercator](http://bl.ocks.org/3757132) - Mercator
* [d3.geo.miller](http://bl.ocks.org/3734333) - Miller
* [d3.geo.mollweide](http://bl.ocks.org/3734336) - Mollweide
* d3.geo.mtFlatPolarParabolic - McBryde–Thomas Flat-Polar Parabolic
* d3.geo.mtFlatPolarQuartic - McBryde–Thomas Flat-Polar Quartic
* [d3.geo.nellHammer](http://bl.ocks.org/3734342) - Nell–Hammer
* [d3.geo.orthographic](http://bl.ocks.org/3757125) - Orthographic
* [d3.geo.peirceQuincuncial](http://bl.ocks.org/4310087) - Pierce quincuncial
* [d3.geo.polyconic](http://bl.ocks.org/3734343) - Polyconic
* [d3.geo.robinson](http://bl.ocks.org/3710566) - Robinson
* [d3.geo.quarticAuthalic](http://bl.ocks.org/4463175) - Quartic Authalic
* [d3.geo.satellite](http://bl.ocks.org/3790444) - Satellite (tilted perpsective)
* [d3.geo.sinusoidal](http://bl.ocks.org/3712399) - Sinusoidal
* [d3.geo.sinuMollweide](http://bl.ocks.org/4319903) - Sinu-Mollweide
* [d3.geo.stereographic](http://bl.ocks.org/3757137) - Stereographic
* [d3.geo.vanDerGrinten](http://bl.ocks.org/3796831) - Van der Grinten
* [d3.geo.wagner6](http://bl.ocks.org/3710148) - Wagner VI
* [d3.geo.wiechel](http://bl.ocks.org/4463155) - Wiechel
* [d3.geo.winkel3](http://bl.ocks.org/3682676) - Winkel Tripel

This plugin requires [D3 3.0](https://github.com/mbostock/d3/wiki/Upgrading-to-3.0) or greater. To use the official hosted version, include the projection plugin after including D3:

```html
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://d3js.org/d3.geo.projection.v0.min.js"></script>
```

Alternatively, you can clone this repo, [download the zipball](http://github.com/d3/d3-plugins/zipball/master), or right-click [d3.geo.projection.v0.min.js](http://d3js.org/d3.geo.projection.v0.min.js) and save.

## Defining a New Projection

First define your raw projection function:

```js
function cosinusoidal(λ, φ) {
  return [λ * Math.sin(φ), φ];
}

cosinusoidal.invert = function(x, y) {
  return [x / Math.sin(y), y];
};
```

Then create a constructor using d3.geo.projection:

```js
d3.geo.cosinusoidal = function() {
  return d3.geo.projection(cosinusoidal);
};
```

You can optionally expose the raw projection to facilitate composite projections:

```js
(d3.geo.cosinusoidal = function() {
  return d3.geo.projection(cosinusoidal);
}).raw = cosinusoidal;
```
