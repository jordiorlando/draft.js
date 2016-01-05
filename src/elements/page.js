Draft.Page = class Page extends Draft.Group {
  // Set the page's origin relative to its (0, 0) position
  // TODO: remove this?
  origin(x, y) {
    return this.prop({
      'origin.x': x,
      'origin.y': y
    });
  }
};

// TODO: make this modular like the others, and de-dupe the prop code
Draft.extend(Draft, {
  page: function(name) {
    return this.push(this, new Draft.Page(name)).prop({
      system: defaults.system,
      units: defaults.units
    });
  }
});
