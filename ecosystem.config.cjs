module.exports = {
  apps: [
    {
      name: 'marsa-maroc-sme',
      cwd: '/root/marsa-maroc-sme',
      script: './node_modules/.bin/vite',
      args: 'preview --host 0.0.0.0 --port 8000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: '8000',
        HOST: '0.0.0.0'
      }
    }
  ]
};
