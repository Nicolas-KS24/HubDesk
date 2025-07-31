const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hubdesk.db");

//criação de tabela de usuários com permissões
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      permissao TEXT CHECK(permissao IN ('Administrador', 'Colaborador', 'Cliente')) NOT NULL
    )
  `);
});

module.exports = db;
// Exporta o banco de dados para uso em outros módulos