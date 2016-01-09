// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

/**
 * Causes your desired class to inherit from a source class. This uses
 * prototypical inheritance so you can override methods without ruining
 * the parent class.
 *
 * This will alter the actual destination class though, it does not
 * create a new class.
 *
 * @param {Function} destination The target class for the inheritance.
 * @param {Function} source Class to inherit from.
 * @param {Boolean} addSuper Should we add the _super property to the prototype? Defaults to true.
 */
Draft.inherit = function(destination, source, addSuper) {
  var proto = destination.prototype = Object.create(source.prototype);
  proto.constructor = destination;

  if (addSuper || typeof addSuper === 'undefined') {
      destination._super = source.prototype;
  }
};

/**
 * Mixes the specified object into your class. This can be used to add
 * certain capabilities and helper methods to a class that is already
 * inheriting from some other class. You can mix in as many object as
 * you want, but only inherit from one.
 *
 * These values are mixed into the actual prototype object of your
 * class, they are not added to the prototype chain like inherit.
 *
 * @param {Function} destination Class to mix the object into.
 * @param {Object} source Object to mix into the class.
 */
Draft.mixin = function(destination, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination.prototype[key] = source[key];
    }
  }
};
