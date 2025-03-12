require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/career-recommendation", async (req, res) => {
  try {
    const userInput = req.body.userInput;

    // ✅ Use Gemini API with correct model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      I am interested in ${userInput}.
      Provide the **top 3 high-growth career paths** in tech.

      **Format the response exactly like this**:

      ## Career Name 1
      **Description:** Short description.
      **Roadmap:**
      - Step 1
      - Step 2
      - Step 3
      - Step 4
      - Step 5
      - Step 6
      - Step 7
      - Step 8
      - Step 9
      - Step 10
      ⏳ **Estimated Time to Learn:** X months

      ## Career Name 2
      **Description:** Short description.
      **Roadmap:**
      - Step 1
      - Step 2
      - Step 3
      - Step 4
      - Step 5
      - Step 6
      - Step 7
      - Step 8
      - Step 9
      - Step 10
      ⏳ **Estimated Time to Learn:** X months

      ## Career Name 3
      **Description:** Short description.
      **Roadmap:**
      - Step 1
      - Step 2
      - Step 3
      - Step 4
      - Step 5
      - Step 6
      - Step 7
      - Step 8
      - Step 9
      - Step 10


      ⏳ **Estimated Time to Learn:** X months
    `;

    const result = await model.generateContent([prompt]);

    // ✅ Extract response as plain text
    let responseText = result?.response?.text() || "AI couldn't generate a response.";

    res.json({ career: responseText });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to fetch career recommendation.", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
