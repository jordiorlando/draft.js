draft.View = class View extends draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */
};

draft.View.require('size');

draft.Group.mixin({
  view(width, height) {
    return this.add(new draft.View()).size(width, height);
  }
});
