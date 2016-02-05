draft.Point = class Point extends draft.Element {};

draft.Point.require('stroke');

draft.Group.mixin({
  point() {
    return this.push(new draft.Point());
  }
});
