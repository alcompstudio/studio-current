module.exports = {
  apps: [{
    name: 'studio-nextjs15',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/studio-app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
