import Groq from "groq-sdk";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateSEO = async (
  topic,
  script
) => {

  const prompt = `
Generate YouTube Shorts SEO.

Topic: ${topic}

Script:
${script}

Return JSON only:

{
  "seoTitle":"",
  "seoDescription":"",
  "tags":[],
  "hashtags":[],
  "keywords":[],
  "seoScore":0,
  "seoReason":""
}
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

      let text = response.choices[0].message.content;
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(text);
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