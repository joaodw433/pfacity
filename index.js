const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000

// Configurar o diretório de arquivos estáticos (pasta public)
app.use(express.static('public'));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'public', 'musicas');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = file.originalname.split('.')[0]; // Pega o nome do arquivo original
        cb(null, `${fileName}${ext}`);
    }
});

const upload = multer({ storage: storage });

// Servir a página inicial (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para upload de arquivos
app.post('/upload', upload.single('musica'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const fileName = req.file.filename;
    const fileUrl = `https://perifacity.discloud.app/musicas/${fileName}`;
    
    // Redireciona o usuário para o link da música em uma nova aba
    res.redirect(fileUrl);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
