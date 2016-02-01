draft.types.opacity = function opacity(val) {
  if (val == undefined) {
    return val;
  }

  var from0to1 = /^(0(\.\d*)?|1(\.0*)?)$/;

  if (from0to1.test(val)) {
    return parseFloat(val, 10);
  }

  return undefined;
};
