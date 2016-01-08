var Draft = this.Draft = {
  mixins: {},

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
