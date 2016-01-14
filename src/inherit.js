// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

draft.inherit = function(destination, source, addSuper) {
  var proto = destination.prototype = Object.create(source.prototype);
  proto.constructor = destination;

  if (addSuper || typeof addSuper === 'undefined') {
    destination._super = source.prototype;
  }
};

draft.mixin = function(destination, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination.prototype[key] = source[key];
    }
  }
};
