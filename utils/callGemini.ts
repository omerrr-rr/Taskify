export const callGemini = async (prompt: string) => {
  const API_KEY = 'AIzaSyAhVhj00YGyBM6Gv2yQXXFzLopBvhcbfAY'; // keep your actual key here

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  console.log("📦 Gemini raw response:\n", JSON.stringify(data, null, 2));
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Gemini returned an empty response.';
};
