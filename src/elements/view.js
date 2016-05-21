draft.View = class View extends draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */

  get map() {
    return ['x', 'y', 'z', 'alpha', 'width', 'height'];
  }

  get aspectRatio() {
    var width = draft.newLength(this.prop('width')).value;
    var height = draft.newLength(this.prop('height')).value;

    var gcd = function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    };

    gcd = gcd(width, height);
    return `${width / gcd}:${height / gcd}`;
  }
};

draft.View.mixin([
  'translate',
  'rotate',
  'scale',
  'svg'
]);

draft.Group.mixin({
  // TODO: get group bounding box for default size
  view(name) {
    return this.append(new draft.View(name)).size(100, 100);
  }
});
