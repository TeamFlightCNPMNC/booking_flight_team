module.exports = {
  apps: [
    {
      name: "react-client",
      script: "start.js",
      cwd: "./",
      env: {
        PORT: 3000,
        NODE_ENV: "development",
      },
    },
  ],
};
