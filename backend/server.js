const express = require('express');
const bycrypt = require('bcrypt');
const cors = require('cors');
const db = require("./db.js");

//faz os requerimentos necessários

const app = express();
app.use(cors());
app.use(express.json());

//Registro 
app.post("/register", async (req, res) => {
    const { nome, email, senha, permissao } = req.body;


if (!nome || !email || !senha || !permissao)
    return res.status(400).json({ error: "Preencha Todos os Campos."})

    const senhaHash = await bcrypt.hash(senha, 10);

    db.run(
        "INSERT INTO usuarios (nome, email, senha, permissao) VALUES (?, ?, ?, ?)",
        [nome, email, senhaHash, permissao],
        function (err){
            if (err) return res.status(400).json({ error: "Email ja cadastrado." });
            res.json({ mensagem: "Usuario cadastrado com sucesso!"});
        }
    );
});

//Login com verificação de permissão 
app.post("/Login", (req,res) => {
    const { email, senha, permissao } = req.body;

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (err, user) => {
        if (!user) return res.status(404).json({ erro: "Usuario não encontrado."});

        const match = await bcrypt.compare(senha, user.senha);

        if (!match) return res.status(401).json({ erro: "Senha incorreta" });
        if (user.permissao !== permissao)
        return res.status(403).json({ erro: `Permissão inválida. Você é ${user.permissao}.` });

        res.json({
            mensagem: "Login bem-sucedido",
            nome: user.nome,
            permissao: user.permissao
    });
  });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});