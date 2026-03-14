const axios = require('axios');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

/**
 * Prompt to extract structured CV data from raw text
 */
const GENERATE_PROMPT = `
You are an expert CV parser. Extract information from the provided text and return a valid JSON object matching this schema exactly:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or empty for present",
      "isCurrent": boolean,
      "description": "HTML string with <mark> or <span> for highlights"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "e.g. 2018 - 2022",
      "description": "string"
    }
  ],
  "skills": [
    { "name": "string" }
  ]
}

Rules:
1. Return ONLY the JSON object. No other text.
2. If info is missing, use empty string or empty array.
3. For experience description, use professional tone and subtle HTML formatting.
`;

/**
 * Prompt to translate CV content to English
 */
const TRANSLATE_PROMPT = `
You are a professional translator. Translate the following CV JSON object into English.
Maintain the exact same JSON structure and keys. 
Only translate the values (content).
Keep any HTML tags like <mark> or <span> exactly as they are but translate the text inside them.
Return ONLY the translated JSON object.
`;

const aiController = {
    generateFromText: async (req, res) => {
        const { text } = req.body;
        const apiKey = process.env.DEEPSEEK_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'AI Service not configured' });
        }

        try {
            const response = await axios.post(DEEPSEEK_API_URL, {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: GENERATE_PROMPT },
                    { role: "user", content: text }
                ],
                response_format: { type: "json_object" }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = JSON.parse(response.data.choices[0].message.content);
            res.json(content);
        } catch (error) {
            console.error('AI Generation Error:', error.response?.data || error.message);
            res.status(500).json({ message: 'Error generating CV with AI' });
        }
    },

    translateToEnglish: async (req, res) => {
        const { cvData } = req.body;
        const apiKey = process.env.DEEPSEEK_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'AI Service not configured' });
        }

        try {
            const response = await axios.post(DEEPSEEK_API_URL, {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: TRANSLATE_PROMPT },
                    { role: "user", content: JSON.stringify(cvData) }
                ],
                response_format: { type: "json_object" }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = JSON.parse(response.data.choices[0].message.content);
            res.json(content);
        } catch (error) {
            console.error('AI Translation Error:', error.response?.data || error.message);
            res.status(500).json({ message: 'Error translating CV with AI' });
        }
    },

    healthCheck: (req, res) => {
        res.json({
            status: 'AI Service is active',
            apiKeyConfigured: !!process.env.DEEPSEEK_API_KEY,
            endpoint: DEEPSEEK_API_URL
        });
    }
};

module.exports = aiController;
