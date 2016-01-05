Draft.system = {
  // Cartesian:
  // - page.system('cartesian')
  // - (x, y)
  // - x is right, y is up, z is out of the page (right-hand)
  // - global origin (0, 0) is at bottom-left
  //
  // Polar:
  // - page.system('polar')
  // - (r, phi)
  // - phi is counter-clockwise, with 0 pointing to the right
  // - global pole (0, 0) is at center
  //
  // TODO: remove this?
  // Web/SVG:
  // - page.system('web')
  // - (x, y)
  // - x is right, y is down, z is out of the page (left-hand)
  // - global origin (0, 0) is at top-left

  // TODO: switch phi for theta?
  // TODO: Spherical (p, theta, phi), Cylindrical (p, phi, z)
  system: function (system) {
    /*if (this.prop('system') != system) {
      // TODO: recursively convert all elements to new system?
    }*/
    return this.prop('system', system);
  }
};
