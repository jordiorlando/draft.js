draft.mixins.transform = {
  transform(transform, ...args) {
    var obj = {
      transform,
      args: {}
    };
    transform = draft.transforms[transform];

    for (let arg in args) {
      let prop = transform.args[arg];
      obj.args[prop] = args[arg];

      if (this.map.includes(prop)) {
        let val = transform.transform.call(this, prop, args[arg]);
        this.prop(prop, val);
      }
    }

    this.transforms.push(obj);
    this.fire(`transform.${obj.transform}`, obj);

    return this;
  }
};
