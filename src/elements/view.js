draft.View = class View extends draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */

  get aspectRatio() {
    var width = draft.px(this.prop('width'));
    var height = draft.px(this.prop('height'));

    var gcd = function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    };

    gcd = gcd(width, height);
    return `${width / gcd}:${height / gcd}`;
  }
};

draft.View.require('size');

draft.Group.mixin({
  // TODO: get group bounding box for default size
  view(width = 100, height = 100) {
    return this.push(new draft.View()).size(width, height);
  }
});
