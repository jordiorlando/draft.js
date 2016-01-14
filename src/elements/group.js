Draft.Group = class Group extends Draft.Container {};

Draft.Group.require([
  'system',
  'units'
]);

// TODO: mixin to Draft.group
Draft.Container.mixin({
  group() {
    return this.add(new Draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
