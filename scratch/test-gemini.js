const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const apiKey = "AIzaSyATWTWaxu1_s2NSTGeGv3QlfCHUINFV77Y";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hedy, di 'Listo para servir, Epotech'");
    console.log("SUCCESS:", result.response.text());
  } catch (e) {
    console.error("ERROR DETAIL:", e);
  }
}

test();
