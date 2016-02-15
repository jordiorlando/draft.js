draft.Rectangle = class Rectangle extends draft.Shape {
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
};

draft.Group.mixin({
  // TODO: rename to rectangle(name)
  rect(name) {
    return this.append(new draft.Rectangle(name)).size(75, 100);
  }
});
