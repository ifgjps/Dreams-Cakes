const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const port = 3000;
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:ifg@localhost:5432/dreamscakes';
const client = new pg.Client(connectionString);
client.connect();

router.post('/api/v1/criar', (req, res, next) => {

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
    client.query('INSERT INTO itens(quantidadeproduto, endereço) values($1, $2)',
    [req.body.quantidadeproduto, req.body.endereço]);
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

router.delete('/api/v1/deletar/:todo_id', (req, res, next) => {

  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  console.log(id);
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
});

router.put('/api/v1/atualizar/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
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
    client.query('UPDATE itens SET quantidadeproduto=($1), endereço=($2) WHERE id=($3)',
    [req.body.quantidadeproduto, req.body.endereço, id]);
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


router.get('/api/v1/pesquisar/:pesquisa', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const valor = req.params.pesquisa;
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
    const query = client.query('SELECT * from itens where id = ($1)',
    [valor]);
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

router.get('/api/v1/pesquisar', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const valor = req.params.pesquisa;
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
    const query = client.query('SELECT * from itens');
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
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);
//Modificaçoes aula 19/05


//inicia o servidor
app.listen(port);
console.log('API funcionando!');