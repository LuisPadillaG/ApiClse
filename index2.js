import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

// Leer base de datos
const readData = () => {
  try {
    const data = fs.readFileSync("./dbdos.json");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

// Escribir en la base de datos
const writeData = (data) => {
  try {
    fs.writeFileSync("./dbdos.json", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(err);
  }
};

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.send("Welcome to Sports API!");
});

// Obtener todos los deportes
app.get("/deportes", (req, res) => {
  const data = readData();
  res.json(data.deportes);
});

// Obtener un deporte por ID
app.get("/deportes/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const deporte = data.deportes.find((d) => d.id === id);
  
  if (!deporte) {
    return res.status(404).json({ message: "Deporte no encontrado" });
  }
  
  res.json(deporte);
});

// Crear un nuevo deporte
app.post("/deportes", (req, res) => {
  const data = readData();
  const body = req.body;
  const newDeporte = {
    id: data.deportes.length > 0 ? data.deportes[data.deportes.length - 1].id + 1 : 1,
    ...body,
  };
  data.deportes.push(newDeporte);
  writeData(data);
  res.status(201).json({ message: "Deporte creado exitosamente", deporte: newDeporte });
});

// Actualizar un deporte por ID
app.put("/deportes/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const deporteIndex = data.deportes.findIndex((d) => d.id === id);

  if (deporteIndex === -1) {
    return res.status(404).json({ message: "Deporte no encontrado" });
  }

  data.deportes[deporteIndex] = {
    ...data.deportes[deporteIndex],
    ...body,
  };

  writeData(data);
  res.json({ message: "Deporte actualizado exitosamente" });
});

// Eliminar un deporte por ID
app.delete("/deportes/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const deporteIndex = data.deportes.findIndex((d) => d.id === id);

  if (deporteIndex === -1) {
    return res.status(404).json({ message: "Deporte no encontrado" });
  }

  data.deportes.splice(deporteIndex, 1);
  writeData(data);
  res.json({ message: "Deporte eliminado exitosamente" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});