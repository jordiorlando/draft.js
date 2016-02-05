draft.types.Float = class Float {
  constructor(value) {
    this.value = parseFloat(value);
  }

  get type() {
    return 'float';
  }

  get regex() {
    // Matches all floating point values. Should match:
    // 123
    // -123.45
    // 123e5
    // 123.45E+5
    return '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?';
  }

  valueOf() {
    return this.value;
  }
};

draft.types.float = function float(value) {
  return value == undefined ? value : new draft.types.Float(value);
};
