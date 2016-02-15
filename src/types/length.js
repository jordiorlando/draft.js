draft.defaults.unit = 'px';

// TODO: make type, regex, units, and test static
draft.types.Length = class Length extends draft.types.Float {
  constructor(value, unit) {
    super(value);

    value = this.test(value);
    unit = this.test(unit);

    if (!isNaN(this.value) && (value || unit)) {
      this.unit = value || unit;
      this.convert(unit);
    } else {
      this.unit = draft.defaults.unit;
    }
  }

  get type() {
    return 'length';
  }

  get regex() {
    return '(px|pt|pc|in|ft|yd|mi|mm|cm|dm|km|m)';
  }

  get units() {
    return {
      px: [1, 1, 'px'],
      pt: [1, 72, 'px'],
      pc: [12, 1, 'pt'],
      in: [draft.defaults.dpi, 1, 'px'],
      ft: [12, 1, 'in'],
      yd: [3, 1, 'ft'],
      mi: [1760, 1, 'yd'],
      mm: [1, 25.4, 'in'],
      cm: [10, 1, 'mm'],
      dm: [10, 1, 'cm'],
      m: [10, 1, 'dm'],
      km: [1000, 1, 'm']
    };
  }

  test(val) {
    // TODO: strict match anchor (^ instead of word end)
    val = new RegExp(`${this.regex}$`, 'i').exec(val);
    return val ? val[0].toLowerCase() : false;
  }

  convert(newUnit) {
    newUnit = this.test(newUnit);

    if (!newUnit) {
      return false;
    }

    var chain = (unit, reverse) => {
      let units = this.units[unit];

      this.value *= reverse ? units[1] : units[0];
      this.value /= reverse ? units[0] : units[1];

      return units[2];
    };

    let unit = this.unit;
    while (unit !== newUnit && unit !== 'px') {
      unit = chain(unit);
    }

    if (unit !== newUnit) {
      unit = newUnit;
      while (unit !== 'px') {
        unit = chain(unit, true);
      }
    }

    this.unit = newUnit;

    return this.toString();
  }

  valueOf() {
    // TODO: use px instead of draft.defaults.unit?
    return new Length(this.toString(), draft.defaults.unit).value;
  }

  toString() {
    return this.value + this.unit;
  }
};

draft.types.length = function length(value, unit) {
  return value == undefined ? value : new draft.types.Length(value, unit);
};
