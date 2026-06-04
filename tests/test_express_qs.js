import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  const params = new URLSearchParams(req.query);
  const rawQuery = req.url.split('?')[1] || '';
  
  res.json({
    reqQuery: req.query,
    urlSearchParams: params.toString(),
    rawQuery: rawQuery
  });
});

app.listen(3002, async () => {
  console.log("Server listening on 3002");
  const res = await fetch('http://localhost:3002/test?marka_id[0]=123&s_yers[0]=1980');
  console.log(await res.json());
  process.exit(0);
});
