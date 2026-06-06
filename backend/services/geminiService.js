import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateScript = async (topic) => {
  const prompt = `
Create a viral YouTube Shorts script.

Topic: ${topic}

Return ONLY valid JSON.

{
"title":"",
"hook":"",
"englishScript":"",
"hindiScript":""
}

Requirements:

* Strong viral hook
* 45-60 second script
* Natural Hindi translation
* No markdown
  `;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      });

      const text = response.choices[0].message.content;
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (error) {
      if ((error.status === 429 || error.status === 503) && attempt < MAX_RETRIES) {
        console.log(`Attempt ${attempt} failed. Retrying in ${RETRY_DELAY * attempt}ms...`);
        await delay(RETRY_DELAY * attempt);
      } else {
        throw error;
      }
    }
  }
};
