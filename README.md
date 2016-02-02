# draft.js
_inspired by [SVG.js](https://github.com/wout/svg.js)_

**draft.js** is a lightweight library for parametric design.

draft.js is licensed under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Installation

Prebuilt distributions can be found on the [releases](https://github.com/D1SC0tech/draft.js/releases) page.

You can also use [`Bower`](http://bower.io) or [`npm`](https://npmjs.com/package/draft.js):

```sh
# Install via Bower
bower install draft.js

# Install via npm
npm install draft.js
```

## Documentation

Guides and API reference are located in the [docs](https://github.com/D1SC0tech/draft.js/tree/master/docs) directory and on the [wiki](https://github.com/D1SC0tech/draft.js/wiki) page.

## Getting Started

Include the library at the top of your html file:

```html
<head>
  ...
  <script src="draft.js/dist/draft.min.js"></script>
</head>
<body>
  <div id="view" style="width: 100%; height: 100%"></div>
</body>
```

Write a new script and include it after your html content:

```javascript
// Create a new draft document and add a group to it
var doc = draft('my_document');
var group = doc.group();

// Add some shapes to the group
var rect = group.rect(200, 150).fill('#18f');
var circle = group.circle(50).fill('#f1c');

// Create a view for the group
var view = group.view(600, 400);

// Use the draft-svg plugin to render an image
var body = document.getElementById('body');
body.appendChild(view.svg());
```

## Plugins

- [draft-svg](https://github.com/D1SC0tech/draft-svg)
- [draft-treeview](https://github.com/D1SC0tech/draft-treeview)

## Contributing

- Follow the [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)
- Indent with two spaces
- Use semicolons at the ends of lines

## Acknowledgements

- [Wout Fierens](https://github.com/wout), [Ulrich-Matthias Schäfer](https://github.com/Fuzzyma), and all the other contributors to the SVG.js library.
- [Oliver Caldwell](https://github.com/Olical) for creating [EventEmitter](https://github.com/Olical/EventEmitter), a library for using DOM-like events without the DOM, and [Heir](https://github.com/Olical/Heir), a tiny script for object inheritance and mixins.
