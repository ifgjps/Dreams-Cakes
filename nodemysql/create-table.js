const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const port = 3000;
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:ifg@localhost:5432/Dreams Cakes';
const client = new pg.Client(connectionString);
client.connect();

router.get('/api/v1/criar', (req, res, next) => {

 const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO itens(nome, sobrenome) values($1, $2)',
    ['John Pereira', 'Souza']);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM itens ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


router.get('/api/v1/delete/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM itens WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM itens ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
})




router.get('/api/v1/update/:todo_id/:nome/:sobrenome', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  const nome = req.params.nome;
  const sobrenome = req.params.sobrenome;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE itens SET nome=($1), sobrenome=($2) WHERE id=($3)',
    [nome,sobrenome, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM itens ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});




router.get('/api/v1/pesquisa/:pesquisa', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const pesquisa = req.params.pesquisa;
    // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
	
   console.log(err);
    const query = client.query('SELECT * FROM itens WHERE id=($1)', [pesquisa] );
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});








//conf o body parser para pegar post mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);


//inicia o servidor
app.listen(port);
console.log('API funcionando!');