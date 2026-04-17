async function test() {
  const apiKey = "AIzaSyATWTWaxu1_s2NSTGeGv3QlfCHUINFV77Y";
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hola" }] }]
      })
    });
    
    const data = await response.json();
    console.log("STATUS:", response.status);
    console.log("RESPONSE:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("FETCH ERROR:", e);
  }
}

test();
