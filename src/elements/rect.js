draft.Rect = class Rect extends draft.Shape {
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

draft.Rect.mixin('radius');

draft.Group.mixin({
  rect(name) {
    return this.push(new draft.Rect(name)).size(100, 100);
  }
});
