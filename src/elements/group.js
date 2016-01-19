draft.Group = class Group extends draft.Container {};

draft.Group.require([
  'system',
  'units'
]);

// TODO: mixin to draft.Group?
draft.Container.mixin({
  group(name) {
    return this.push(new draft.Group(name)).prop({
      system: this.prop('system'),
      units: this.prop('units')
    });
  }
});
