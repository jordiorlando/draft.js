draft.Square = class Square extends draft.Rectangle {
  get map() {
    return super.map.map(val => {
      if (val !== 'height') {
        return val;
      }
    });
  }

  get propMap() {
    return {
      width: ['width', 'height']
    };
  }
};

draft.Group.mixin({
  square(name) {
    return this.append(new draft.Square(name)).size(100);
  }
});
