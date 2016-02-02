draft.types.opacity = function opacity(val) {
  var from0to1 = /^(0(\.\d*)?|1(\.0*)?)$/;

  if (val === undefined || val === null) {
    return val;
  } else if (from0to1.test(val)) {
    return parseFloat(val, 10);
  }
};
