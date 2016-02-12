draft.Group = class Group extends draft.Container {};

draft.Group.mixin([
  'system',
  'units'
]);

// TODO: mixin to draft.Group?
draft.Container.mixin({
  group(name) {
    return this.append(new draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
