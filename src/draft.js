var draft = function draft(name) {
  return draft.doc(name);
};

// TODO: configurable defaults
draft.defaults = {
  system: 'cartesian',
  units: 'px',
  get dpi() {
    var test = document.createElement('div');
    test.style.width = '1in';
    test.style.padding = 0;
    document.getElementsByTagName('body')[0].appendChild(test);

    var dpi = test.offsetWidth;

    document.getElementsByTagName('body')[0].removeChild(test);

    // Fall back to standard 96dpi resolution
    return dpi || 96;
  }
};

// Initialize types and mixins
draft.types = {};
draft.mixins = {};
