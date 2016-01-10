Draft.mixins.rotation = {
  rotation: function(alpha, beta, gamma) {
    return this.prop({
      alpha: alpha,
      beta: beta,
      gamma: gamma
    });
  },

  rot: function(alpha, beta, gamma) {
    return this.rotation(alpha, beta, gamma);
  }
};
