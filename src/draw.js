var Draw = this.Draw = function (element) {
  // return SVG(element);
  return {};
};

Draw.id = 1000;
Draw.pages = [];

Draw.defaults = {
  x: 0,
  y: 0,
  width: 0,
  length: 0,
  originX: 0,
  originY: 0,
  a: 0
};

Draw.inherit = function (prototype) {
  for (var method in prototype) {
    if (method == 'inherit') {
      for (let i in prototype[method]) {
        Draw.inherit.call(this, prototype[method][i]);
      }
    } else if (typeof prototype[method] === 'function') {
      this[method] = prototype[method];
    }
  }
};



/*function (element) {
  if (element) {
    // Ensure the presence of a dom element
    element = typeof element == 'string' ?
              document.getElementById(element) :
              element;

    element.node = element
    return element;
  }
};*/

/*SVG.extend(SVG.Element, {
  x: function (x) {
    return this.attr('x', x);
  },
  y: function (y) {
    return this.attr('y', -y);
  },
  rotate: function (r, cx, cy) {
    return this.transform({ rotation: -r, cx: cx, cy: -cy }, true);
  },
  skew: function (x, y, cx, cy) {
    return this.transform({ skewX: x, skewY: y, cx: cx, cy: -cy }, true);
  },
  translate: function (x, y) {
    return this.transform({ x: x, y: -y }, true);
  },
  move: function (x, y) {
    return this.translate(x, y);
  },
  width: function (w) {
    return this.attr('width', w);
  },
  height: function (h) {
    return this.attr('height', h);
  }
});*/
