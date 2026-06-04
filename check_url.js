async function checkUrls() {
  try {
    const res = await fetch('https://cars.ua/search/?make=Toyota', { method: 'GET' });
    console.log('cars.ua search status:', res.status);
    console.log('cars.ua search url:', res.url);
  } catch (err) {
    console.error('cars.ua error:', err.message);
  }
}
checkUrls();
