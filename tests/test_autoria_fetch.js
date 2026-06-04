const apiKey = "0GFUwvt6X0aN5uZtUDmppruNsDnNX0gnRAMg7818";

async function testAutoRia() {
  const url1 = `https://developers.auto.ria.com/auto/search?api_key=${apiKey}&category_id=1&marka_id[0]=79`;
  const url2 = `https://developers.ria.com/auto/search?api_key=${apiKey}&category_id=1&marka_id[0]=79`;
  const url3 = `https://auto.ria.com/api/search/auto?api_key=${apiKey}&category_id=1&marka_id[0]=79`;
  const url4 = `https://api.auto.ria.com/auto/search?api_key=${apiKey}&category_id=1&marka_id[0]=79`;

  const urls = [url1, url2, url3, url4];

  for (const u of urls) {
    try {
      console.log("Testing:", u.split('?')[0]);
      const res = await fetch(u);
      console.log("Status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Result items:", data?.result?.search_result?.count || 0);
      } else {
        console.log("Error body:", await res.text());
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
  }
}
testAutoRia();
