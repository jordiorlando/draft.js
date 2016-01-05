Draft.Group = class Group extends Draft.Container {
};

Draft.Group.extend([
  'system',
  'units'
]);

Draft.Container.extend({
  group: function(name) {
    return this.add(new Draft.Group(name)).prop({
      system: this.system(),
      units: this.units()
    });
  }
});
