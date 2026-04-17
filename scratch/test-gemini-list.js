async function test() {
  const apiKey = "AIzaSyATWTWaxu1_s2NSTGeGv3QlfCHUINFV77Y";
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("STATUS:", response.status);
    console.log("AVAILABLE MODELS:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("FETCH ERROR:", e);
  }
}

test();
