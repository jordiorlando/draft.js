// TODO: configurable defaults
draft.defaults = {
  system: 'cartesian',
  units: 'px',
  /* width: 0,
  length: 0,
  r: 0, // radius
  a: 0, // angle */

  get dpi() {
    var test = document.createElement('div');
    test.style.width = '1in';
    test.style.padding = 0;
    document.getElementsByTagName('body')[0].appendChild(test);

    var dpi = test.offsetWidth;

    document.getElementsByTagName('body')[0].removeChild(test);

    // Fall back to standard 96dpi resolution
    return dpi || 96;
  }
  /* ,

  // Cartesian coordinates
  cartesian: {
    layer: 1,
    vars: [
      'x',
      'y',
      'z'
    ],
    web: [
      function(pos) {
        return pos[0];
      },
      function(pos) {
        return height - pos[1];
      },
      function(pos) {
        return pos[2];
      },
      // Full position
      function(pos) {
        return [
          pos[0],
          height - pos[1],
          pos[2]
        ];
      }
    ],
    polar: [
      function(pos) {
        return Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2));
      },
      function(pos) {
        return Math.atan2(pos[1], pos[0]);
      },
      function(pos) {
        return pos[2];
      },
      // Full position
      function(pos) {
        return [
          Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2)),
          Math.atan2(pos[1], pos[0]),
          pos[2]
        ];
      }
    ],
    origin: {
      x: 0,
      y: 'height'
    }
  },

  // Polar/Cylindrical coordinates
  polar: {
    layer: 2,
    vars: [
      'ρ',
      'φ',
      'z'
    ],
    cartesian: [
      function(pos) {
        return pos[0] * Math.cos(pos[1] * (Math.PI / 180));
      },
      function(pos) {
        return pos[0] * Math.sin(pos[1] * (Math.PI / 180));
      },
      function(pos) {
        return pos[2];
      }
    ],
    origin: {
      x: 'width/2',
      y: 'height/2'
    }
  },

  // Spherical coordinates
  spherical: {
    layer: 2,
    vars: [
      'ρ',
      'φ',
      'θ'
    ]
  } */
};
