const Service = require('../models/Service');

// @desc    Process AI Chat message
// @route   POST /api/ai/chat
// @access  Private (User)
const processChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        message: 'AI Service is currently unavailable. Please configure GEMINI_API_KEY in the server environment.' 
      });
    }

    // Fetch all active services to provide context to the AI
    const services = await Service.find({});
    
    let serviceContext = "Available Services on ServeEase:\n";
    services.forEach(s => {
      serviceContext += `- ${s.name}: ${s.description} (Base Price: ₹${s.basePrice})\n`;
    });

    const systemPrompt = `You are the official AI Assistant for 'ServeEase', a premium home service booking platform.
Your goal is to help users find and book services. You are helpful, concise, and professional.
Always correlate the user's questions with the company's actual services listed below.

${serviceContext}

Rules:
1. If the user asks for a service we offer, tell them the price and suggest they click the "Request Now" button on their dashboard to book it.
2. If they ask for a service we DO NOT offer, politely inform them that we currently don't provide that service, but suggest the closest alternative if one exists.
3. Keep your answers brief (1-3 sentences maximum). Do not format with markdown, just plain text.
4. Do not offer any services that are not in the list above.`;

    // Format history for Gemini API
    const formattedHistory = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        // Skip the initial welcome message from bot
        if (msg.id === 1) return;
        formattedHistory.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Make request to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt }]
        },
        contents: formattedHistory,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 150,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch AI response');
    }

    const aiText = data.candidates[0].content.parts[0].text;

    res.json({ text: aiText });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: error.message || 'Unable to process AI request at this time.' });
  }
};

module.exports = {
  processChat
};
