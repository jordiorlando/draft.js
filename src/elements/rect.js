draft.Rect = class Rect extends draft.Shape {
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

draft.Rect.require('radius');

draft.Group.mixin({
  rect(width = 100, height = 100) {
    return this.push(new draft.Rect()).size(width, height);
  }
});
