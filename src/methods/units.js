Draft.units = {
  require: [
    Draft.prop
  ],

  // Get/set the element's measurement units
  units: function (units) {
    return this.prop('units', units);
  }
};
