const PrerenderSPAPlugin = require("prerender-spa-plugin");
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, "build"),
      routes: ["/", "/about"],
    }),
  ],
};
