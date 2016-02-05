draft.types.Color = class Color {
  constructor(color) {
    color = new RegExp(`^(?:${this.regex})$`, 'i').exec(
      isNaN(color) ? color : color.toString(16));

    if (color !== null) {
      this.color = color[0].toLowerCase();

      for (let i = 1; i <= 3; i++) {
        color[i] = parseInt(color[i] ||
          parseInt(color[i + 3] || color[i + 6].repeat(2), 16), 10);
      }

      this.red = color[1];
      this.green = color[2];
      this.blue = color[3];
    }
  }

  get type() {
    return 'color';
  }

  get regex() {
    var rgbColor = '([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])';
    var rgb = `rgb\\(${rgbColor}, ?${rgbColor}, ?${rgbColor}\\)`;

    var hexColor = '([0-9a-f]{2})'.repeat(3);
    var hex = `#?(?:${hexColor}|${hexColor.replace(/\{2\}/g, '')})`;
    // var hex = '#?(?:[0-9a-f]{3}){1,2}';

    return `${rgb}|${hex}`;
  }

  valueOf() {
    return (this.red << 16) | (this.green << 8) | this.blue;
  }

  toString() {
    return this.color;
  }
};

draft.types.color = function color(value) {
  return value == undefined ? value : new draft.types.Color(value);
};
