module.exports = {
  apps: [
    {
      name: 'threadclip',
      script: 'node',
      args: 'server.js',
      cwd: '/home/opc/threadsclip/.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      env_file: '/home/opc/threadsclip/.env.production',
      max_memory_restart: '500M',
      error_file: '/home/opc/logs/threadclip-error.log',
      out_file: '/home/opc/logs/threadclip-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
