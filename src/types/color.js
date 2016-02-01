draft.types.color = function color(val) {
  if (val == undefined) {
    return val;
  }

  var hex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

  var rgb255 = '([01]?\\d\\d?|2[0-4]\\d|25[0-5])';
  var rgb = new RegExp(`^rgb\\(${rgb255}\\, ?${rgb255}\\, ?${rgb255}\\)$`, 'i');

  if (hex.test(val)) {
    return val;
  } else if (rgb.test(val)) {
    return val;
  }

  return undefined;
};
