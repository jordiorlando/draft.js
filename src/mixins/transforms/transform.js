draft.mixins.transform = {
  transform(obj) {
    // BACKLOG:30 make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = obj[k] === null || obj[k] === undefined ?
        obj[k] : this.prop(k) + obj[k];
    }

    return this.prop(obj);
  }
};
