var Draft = this.Draft = {
  mixins: {},

  // TODO:20 add thank you to Olical for Heir
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
  inherit: function(destination, source, addSuper) {
    var proto = destination.prototype = Object.create(source.prototype);
    proto.constructor = destination;

    if (addSuper || typeof addSuper === 'undefined') {
        destination._super = source.prototype;
    }
  },

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
  mixin: function(destination, source) {
    // Uses `Object.prototype.hasOwnPropety` rather than `object.hasOwnProperty`
    // as it could be overwritten.
    var hasOwnProperty = function(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    };

    for (var key in source) {
      if (hasOwnProperty(source, key)) {
        destination.prototype[key] = source[key];
      }
    }
  },

  // DOING:0 rename methods to mixins

  // Construct a unique ID from the element's type and ID
  domID: function(element) {
    return 'DraftJS_' +
      element.prop('type') + '_' +
      zeroPad(element.prop('id'), 4);
  },

  // Using standard 96dpi resolution
  // BACKLOG:50 configurable dpi setting
  // TODO:50 safety checks
  // TODO:60 use regexes
  px: function(length) {
    var num = parseFloat(length, 10);
    var units = typeof length == 'string' ? length.slice(-2) : 'px';

    // Remain unchanged if units are already px
    if (units == 'px') {
      return num;
    }
    // Points and picas (pt, pc)
    else if (units == 'pt') {
      return Draft.px(num / 72 + 'in');
    } else if (units == 'pc') {
      return Draft.px(num * 12 + 'pt');
    }
    // Imperial units (in, ft, yd, mi)
    else if (units == 'in') {
      return num * 96;
    } else if (units == 'ft') {
      return Draft.px(num * 12 + 'in');
    } else if (units == 'yd') {
      return Draft.px(num * 3 + 'ft');
    } else if (units == 'mi') {
      return Draft.px(num * 1760 + 'yd');
    }
    // Metric units (mm, cm, m, km)
    else if (units.endsWith('m')) {
      if (units == 'mm') {
        num *= 1;
      } else if (units == 'cm') {
        num *= 10;
      } else if (units == 'km') {
        num *= 1000000;
      }

      return Draft.px(num / 25.4 + 'in');
    } else {
      return false;
    }
  }
};
