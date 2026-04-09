const app = require("./server");

const PORT = parseInt(process.env.PORT || "5003", 10);
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT}`);
});

