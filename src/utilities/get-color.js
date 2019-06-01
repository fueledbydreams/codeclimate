module.exports = (grade) => {
  if (grade === 'A') {
    return "#45d298";
  } else if (grade === 'B') {
    return "#a5d86e";
  } else if (grade === 'C') {
    return "#f1ce0c";
  } else if (grade === 'D') {
    return "#f29141";
  } else if (grade === 'F') {
    return "#df5869";
  } else {
    return "#ffffff";
  }
};
