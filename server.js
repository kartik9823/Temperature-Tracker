import express from "express";

const app = express();

app.use(express.static("dist")); // Assuming Vite's build output is stored in `dist`

const PORT = process.env.PORT || 10000; // Default Render port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});