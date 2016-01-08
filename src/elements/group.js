Draft.Group = class Group extends Draft.Container {};

Draft.Group.require([
  'system',
  'units'
]);

Draft.Container.mixin({
  group: function() {
    return this.add(new Draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
