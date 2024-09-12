const app = require('./app');

// Start the server

app.listen(app.get('port'), () => {
  console.log('Servidor listening on port ' + app.get('port'));
});