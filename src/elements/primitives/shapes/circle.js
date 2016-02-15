draft.Circle = class Circle extends draft.Ellipse {
  get map() {
    return super.map.map(val => {
      if (val !== 'height') {
        return val;
      }
    });
  }

  /* get propMap() {
    return {
      diameter: ['width', 'height']
    };
  } */

  radius(r) {
    return this.size(r * 2, r * 2);
  }
};

draft.Group.mixin({
  circle(name) {
    return this.append(new draft.Circle(name)).size(100);
  }
});
