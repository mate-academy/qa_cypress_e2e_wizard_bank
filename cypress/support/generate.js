function generateDateRange() {
  const startDate = new Date();
  const randomMinutes = Math.floor(Math.random() * 60); // Случайное количество минут от 0 до 59
  const endDate = new Date(startDate.getTime() + randomMinutes * 60000); // Добавляем случайное количество минут к начальной дате

  const startDateFormatted = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
  const endDateFormatted = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}T${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

  return [startDateFormatted, endDateFormatted];
}

module.exports = { generateDateRange };
