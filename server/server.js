const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for your frontend (adjust the origin as needed)
app.use(cors({ origin: "http://localhost:3000", methods: "GET,POST" }));

// Paths for data files
const dataDir = path.join(__dirname, "data");
const recordsFilePath = path.join(dataDir, "records.json");
const schemaFilePath = path.join(dataDir, "schema.json");

// -------------------- Records Endpoints --------------------

// GET endpoint to load records
app.get("/api/records", (req, res) => {
    fs.readFile(recordsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading records file:", err);
            return res.status(500).json({ error: "Error reading records file" });
        }
        try {
            const records = JSON.parse(data);
            res.json(records);
        } catch (parseErr) {
            console.error("Error parsing records JSON:", parseErr);
            res.status(500).json({ error: "Error parsing records JSON" });
        }
    });
});

// POST endpoint to update/save records
app.post("/api/records", (req, res) => {
    const records = req.body;
    const jsonString = JSON.stringify(records, null, 2);
    fs.writeFile(recordsFilePath, jsonString, "utf8", (err) => {
        if (err) {
            console.error("Error writing records file:", err);
            return res.status(500).json({ error: "Error writing records file" });
        }
        res.json({ message: "Records updated successfully" });
    });
});

// -------------------- Schema Endpoints --------------------

// GET endpoint to load schema
app.get("/api/schema", (req, res) => {
    fs.readFile(schemaFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading schema file:", err);
            return res.status(500).json({ error: "Error reading schema file" });
        }
        try {
            const schema = JSON.parse(data);
            res.json(schema);
        } catch (parseErr) {
            console.error("Error parsing schema JSON:", parseErr);
            res.status(500).json({ error: "Error parsing schema JSON" });
        }
    });
});

// POST endpoint to update/save schema
app.post("/api/schema", (req, res) => {
    const schema = req.body;
    const jsonString = JSON.stringify(schema, null, 2);
    fs.writeFile(schemaFilePath, jsonString, "utf8", (err) => {
        if (err) {
            console.error("Error writing schema file:", err);
            return res.status(500).json({ error: "Error writing schema file" });
        }
        res.json({ message: "Schema updated successfully" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
