const getCurrentDate = () => {
  const currentDate = new Date();

  currentDate.setSeconds(currentDate.getSeconds() + 2);

  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('en-US', { month: 'short' });
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = currentDate.getHours();
  const formattedHours = hours % 12 || 12;
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  return `${month} ${day}, ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

module.exports = { getCurrentDate };
