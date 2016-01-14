var Draft = {
  mixins: {},

  // TODO:50 test safety checks for Draft.px()
  px(val) {
    var num = parseFloat(val, 10);
    var units = testUnits(val);

    switch (units) {
      // Remain unchanged if units are already px
      case 'px':
        return num;

      // Points and picas (pt, pc)
      case 'pc':
        num *= 12;
        // Falls through
      case 'pt':
        num /= 72;
        break;

      // Metric units (mm, cm, dm, m, km)
      case 'km':
        num *= 1000;
        // Falls through
      case 'm':
        num *= 10;
        // Falls through
      case 'dm':
        num *= 10;
        // Falls through
      case 'cm':
        num *= 10;
        // Falls through
      case 'mm':
        num /= 25.4;
        break;

      // Imperial units (in, ft, yd, mi)
      case 'mi':
        num *= 1760;
        // Falls through
      case 'yd':
        num *= 3;
        // Falls through
      case 'ft':
        num *= 12;
        // Falls through
      case 'in':
        break;
      default:
        return undefined;
    }

    return num * Draft.defaults.dpi;
  }
};
