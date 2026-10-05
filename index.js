import express from 'express';
import fs from "fs"; // permite trabajar con file system

const app = express();

app.use(express.json()); 

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
};

app.get("/", (req, res) => {
    res.send("Welcome to my first API with Node js!");
});

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Book updated successfully" });
});

app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: "Book deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});