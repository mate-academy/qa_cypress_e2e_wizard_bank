function formatDate(date) {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00`;
}

module.exports = {
  formatDate
};
