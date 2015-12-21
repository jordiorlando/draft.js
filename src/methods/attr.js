Draw.attr = {
  attr: function (prop, val) {
    if (this.params == null) {
      this.params = {};
    }

    if (prop == null) {
      /*console.log('attr(' + prop + ',' + val + ')->this: ');
      console.log(this);*/

      prop = {};

      for (let p in this.params) {
        prop[p] = this.params[p];
      }

      return prop;
    } else if (typeof prop === 'object') {
      let getter = true;

      for (let p in prop) {
        prop[p] = this.attr(p, prop[p]);
        if (typeof prop[p] === 'object') {
          getter = false;
        }
      }
      if (getter) {
        return prop;
      }
    } else if (val == null) {
      val = this.params[prop];
      return val == null ?
        Draw.defaults[prop] : val;
    } else {
      /*console.log(prop + ', ' + val);
      console.log(this.params);*/
      this.params[prop] = val;
    }

    return this;
  }
};
