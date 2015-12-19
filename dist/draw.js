/*
* draw.js - A lightweight library for parametric drawing
* version v0.0.0
* draw.D1SC0te.ch
*
* copyright Jordi Orlando <jordi.orlando@gmail.com>
* license GPL-3.0
*
* BUILT: Sat Dec 19 2015 05:31:27 GMT-0600 (CST)
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return factory(root, root.document);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS.
    module.exports = root.document ? factory(root, root.document) :
      function (w) {
        return factory(w, w.document);
      };
  } else {
    // Browser globals (root is window)
    root.Draw = factory(root, root.document);
  }
}(typeof window !== "undefined" ? window : this, function (window, document) {

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

Draw.attr = {
  attr: function (key, val) {
    if (key == null) {
      key = {};

      for (let k in this.attr) {
        key[k] = this.attr[k];
      }

      return key;
    } else if (typeof key == 'object') {
      let getter = true;

      for (let k in key) {
        key[k] = this.attr(k, key[k]);
        if (typeof key[k] == 'object') {
          getter = false;
        }
      }
      if (getter) {
        return key;
      }
    } else if (val == null) {
      val = this.attr[key];
      return val == null
        ? Draw.defaults[key]
        : val;
    } else {
      this.attr[key] = val;
    }

    return this;
  }
};

Draw.size = {
  inherit: [
    Draw.attr
  ],
  // Get/set the element's width
  width: function (width) {
    return this.attr('width', width);
  },
  // Get/set the element's height
  height: function (height) {
    return this.attr('height', height);
  },
  // Get/set the element's width & height
  size: function (width, height) {
    return this.attr({
      width: width,
      height: height
    });
  }
};

Draw.move = {
  inherit: [
    Draw.attr
  ],
  // Get/set the element's x position
  x: function (x) {
    return this.attr('x', x);
  },

  // Get/set the element's y position
  y: function (y) {
    return this.attr('y', y);
  },

  // Get/set the element's position
  move: function (x, y) {
    return this.attr({
      x: x,
      y: y
    });
  }
};

Draw.transform = {
  inherit: [
    Draw.attr
  ],
  transform: function (obj) {
    // TODO: make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = (obj[k] == null) ?
        obj[k] : this.attr(k) + obj[k];
    }

    return this.attr(obj);
  }
};

Draw.transforms = {
  inherit: [
    Draw.transform
  ],
  // Translate the element relative to its current position
  translate: function (x, y) {
    return this.transform({
      x: x,
      y: y
    });
  },
  // Scale the element relative to its current size
  scale: function (x, y, cx, cy) {
    /*return this.transform({
      x: x,
      y: y,
      cx: cx,
      cy: cy
    });*/
  },
  // Rotate the element relative to its current angle
  rotate: function (a, cx, cy) {
    /*return this.transform({
      a: a,
      cx: cx,
      cy: cy
    });*/
  },
  // Skew the element relative to its current skew
  skew: function (ax, ay, cx, cy) {
    /*return this.transform({
      ax: ax,
      ay: ay,
      cx: cx,
      cy: cy
    });*/
  }
};

Draw.Element = function () {
  Draw.inherit.call(this, Draw.size);
  Draw.inherit.call(this, Draw.move);

  return this;
};

Draw.Page = function () {
  Draw.inherit.call(this, Draw.size);

  this.origin = function (x, y) {
    // TODO: change to origin.x and origin.y?
    return this.attr({
      originX: x,
      originY: y
    });
  };

  return this;
};

Draw.page = function (name) {
  var page = new Draw.Page()
    .attr('type', 'page')
    .attr('id', Draw.id++)
    .attr('name', name);

  Draw.pages.push(page);
  return page;
};

Draw.Line = function () {
  Draw.inherit.call(this, Draw.size);
  Draw.inherit.call(this, Draw.move);
  Draw.inherit.call(this, Draw.transforms);

  return this;
};

Draw.line = function (x1, y1, x2, y2) {
  var line = new Draw.Line();
  return line;
};


  return Draw;
}));