import express from "express";

const app = express();
const PORT = process.env.PORT;

app.use(express.static("dist")); // Assuming Vite's build output is stored in `dist`

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));