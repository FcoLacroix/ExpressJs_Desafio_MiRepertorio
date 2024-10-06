const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const leerRepertorio = () => {
    const data = fs.readFileSync('repertorio.json', 'utf8');
    return JSON.parse(data);
};

const guardarRepertorio = (data) => {
    fs.writeFileSync('repertorio.json', JSON.stringify(data, null, 2), 'utf8');
};

app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    const repertorio = leerRepertorio();
    repertorio.push(nuevaCancion);
    guardarRepertorio(repertorio);
    res.status(201).json({ mensaje: 'Canción agregada', nuevaCancion });
});

app.get('/canciones', (req, res) => {
    const repertorio = leerRepertorio();
    res.json(repertorio);
});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    let repertorio = leerRepertorio();
    const index = repertorio.findIndex(c => c.id == id);
    if (index !== -1) {
        repertorio[index] = { id, titulo, artista, tono };
        guardarRepertorio(repertorio);
        res.json({ mensaje: 'Canción actualizada', cancion: repertorio[index] });
    } else {
        res.status(404).json({ mensaje: 'Canción no encontrada' });
    }
});

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;
    let repertorio = leerRepertorio();
    const nuevoRepertorio = repertorio.filter(c => c.id != id);
    if (repertorio.length !== nuevoRepertorio.length) {
        guardarRepertorio(nuevoRepertorio);
        res.json({ mensaje: 'Canción eliminada' });
    } else {
        res.status(404).json({ mensaje: 'Canción no encontrada' });
    }
});

app.get('/', (req, res) => {
    res.sendFile('C:/Users/Francisco/Documents/Desafìo Latam/ExpressJs_Desafío2/Apoyo Desafío - Mi repertorio/index.html');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
