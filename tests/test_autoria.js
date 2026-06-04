const url1 = 'https://developers.auto.ria.com/auto/search?api_key=0GFUwvt6X0aN5uZtUDmppruNsDnNX0gnRAMg7818&category_id=1&q=AE86';
const url2 = 'https://developers.ria.com/auto/search?api_key=0GFUwvt6X0aN5uZtUDmppruNsDnNX0gnRAMg7818&category_id=1&q=AE86';

async function test() {
  try {
    console.log("Fetching url1...");
    const res1 = await fetch(url1);
    console.log("url1:", res1.status);
    console.log(await res1.text());
  } catch (err) {
    console.error("url1 error:", err.message);
  }

  try {
    console.log("\nFetching url2...");
    const res2 = await fetch(url2);
    console.log("url2:", res2.status);
    console.log(await res2.text());
  } catch (err) {
    console.error("url2 error:", err.message);
  }
}

test();
