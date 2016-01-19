draft.View = class View extends draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */

  // Get/set the element's width
  get maxWidth() {
    return draft.px(this.prop('maxWidth'));
  }
  // Get/set the element's height
  get maxHeight() {
    return draft.px(this.prop('maxHeight'));
  }

  get aspectRatio() {
    var gcd = function(a, b) {
      return b ? gcd(b, a % b) : a;
    };

    gcd = gcd(this.width(), this.height());
    return `${this.width() / gcd}:${this.height() / gcd}`;
  }
};

draft.View.require('size');

draft.Group.mixin({
  view(width, height) {
    return this.push(new draft.View()).size(width, height);
  }
});
