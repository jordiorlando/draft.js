draft.View = class View extends draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */

  // Get/set the element's width
  maxWidth(maxWidth) {
    return draft.px(this.prop('maxWidth', unit(maxWidth)));
  }
  // Get/set the element's height
  maxHeight(maxHeight) {
    return draft.px(this.prop('maxHeight', unit(maxHeight)));
  }
};

draft.View.require('size');

draft.Group.mixin({
  view(width, height) {
    return this.push(new draft.View()).size(width, height);
  }
});
