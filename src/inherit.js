// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

draft.inherit = function inherit(destination, source, properties) {
  destination.prototype = Object.create(source.prototype, properties);
  destination.prototype.constructor = destination;
  // destination._super = source.prototype;
};

draft.mixin = function mixin(destination, source) {
  if (Array.isArray(source)) {
    for (let val of source) {
      draft.mixin(destination, val);
    }
  } else if (typeof source == 'string') {
    draft.mixin(destination, draft.mixins[source]);
  } else if (typeof source == 'object') {
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        destination.prototype[key] = source[key];
      }
    }
  }
};
