var pg = require('pg');

var Backup = function(){}

Backup.prototype.getTests = function(callback){
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT test_id, results_url FROM tests")
      .on('row', function(row, response){
        response.addRow(row);
      })
      .on('end', function(response){
        done();
        callback(response.rows);
      });
  });
}

Backup.prototype.addBackupToDB = function(test_id,json, callback){
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("INSERT INTO backup (test_id, data) VALUES ($1, $2)",[test_id, json]).on('row', function(row, response){
      response.addRow(row);
    })
    .on('end', function(response){
      console.log('backup successfully stored ', test_id);
      done();
      if(response.rowCount != 0){
        callback(true);
      }
      else{
        callback(false);
      }
     })
    .on('error', function(error){
      console.log(error);
    });
  });
}

module.exports = new Backup();
