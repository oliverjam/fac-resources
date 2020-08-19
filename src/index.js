const server = require("./server.js");
const PORT = process.env.PORT || 3333;

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

// always crash server when promise rejections aren't caught
process.on("unhandledRejection", (error) => {
  console.error(error);
  process.exit(1);
});
