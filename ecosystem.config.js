module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Web Client',
      script    : 'app.js',
      env: {
        PORT: 8000,
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'caseymilstead',
      host : 'beta.planco.world',
      ref  : 'origin/master',
      repo : 'git@github.com:csymlstd/plancoworld.git',
      path : '/var/www/client',
      'post-deploy' : 'npm install && pm2 startOrReload ecosystem.config.js --env production'
    }
  }
};
