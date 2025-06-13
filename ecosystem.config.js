module.exports = {
  apps: [
    {
      name: "doaibustore",
      script: "server.js",
      env: {
        PORT: process.env.PORT || 8080,
        NODE_ENV: "production"
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s"
    },
  ],
}; 