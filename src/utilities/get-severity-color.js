module.exports = (severity) => {
  switch (severity) {
    case 'major':
      return '#eb5757';
    case 'minor':
      return '#ecb208';
    default:
      return 'rgb(0, 118, 255, 0.5)';
  }
};
