draft.Rect = class Rect extends draft.Element {
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

draft.Rect.require([
  'size',
  'radius'
]);

draft.Group.mixin({
  rect(width, height) {
    return this.push(new draft.Rect()).size(width, height);
  }
});
