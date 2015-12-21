Draw.attr = {
  attr: function (key, val) {
    if (key == null) {
      key = {};

      for (let k in this.attr) {
        key[k] = this.attr[k];
      }

      return key;
    } else if (typeof key === 'object') {
      let getter = true;

      for (let k in key) {
        key[k] = this.attr(k, key[k]);
        if (typeof key[k] === 'object') {
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
