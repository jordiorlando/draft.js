# draw.js

**draw.js** is a lightweight library for 2D/3D parametric CAD.

draw.js is licensed under the terms of the [GPL-3.0](https://www.gnu.org/licenses/gpl.html).

## Installation

Prebuilt distributions can be found on the [releases](https://github.com/D1SC0tech/draw.js/releases) page.

You can also use [`Bower`](http://bower.io/) or [`npm`](https://www.npmjs.com/package/draw.js):

```sh
# Install via Bower
bower install draw.js

# Install via npm
npm install draw.js
```

## Documentation

Guides and API reference are located in the [docs](https://github.com/D1SC0tech/draw.js/tree/master/docs) directory and on the [wiki](https://github.com/D1SC0tech/draw.js/wiki) page.

## Getting Started

Include the library at the top of your html file:

```html
<head>
  ...
  <script src="draw.js/dist/draw.min.js"></script>
</head>
<body>
  <div id="canvas" style="width: 100%; height: 100%"></div>
</body>
```

Create a new page inside of an existing html element:

```javascript
var page = Draw.canvas('canvas').page('page_1');
var rect = page.rect(100, 200).fill('#f1c');
```

## Contributing

Follow the [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml) for the most part, with the following notable exceptions:
- Always put the operator at the beginning of the next line if it will not fit

```javascript
var x = a
  + b
  - c;

var x = (a == b)
  ? c
  : d;

var x = foo
  .bar()
  .baz();
```
