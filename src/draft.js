var draft = function draft(name) {
  return draft.doc(name);
};

// Initialize mixins and transforms
draft.mixins = {};
draft.transforms = {};

// TODO: prefer operators at beginning of lines?

// TODO: come up with a better location/interface for createTransform()
draft.createTransform = function createTransform(name) {
  var mixin = {
    [name]: Object.defineProperty(function(...args) {
      return this.transform(name, ...args);
    }, 'name', {
      configurable: true,
      value: name
    })
  };

  return mixin[name];
};
