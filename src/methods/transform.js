Draw.transform = {
  require: [
    Draw.attr
  ],
  transform: function (obj) {
    // TODO: make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = obj[k] == null ?
        obj[k] : this.attr(k) + obj[k];
    }

    return this.attr(obj);
  }
};
