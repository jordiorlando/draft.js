draft.types.color = function color(val) {
  var hex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

  var rgb255 = '([01]?\\d\\d?|2[0-4]\\d|25[0-5])';
  var rgb = new RegExp(`^rgb\\(${rgb255}\\, ?${rgb255}\\, ?${rgb255}\\)$`, 'i');

  if (val === undefined || val === null || hex.test(val) || rgb.test(val)) {
    return val;
  }
};
