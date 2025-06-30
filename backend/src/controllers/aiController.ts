import { Request, Response } from 'express';
import axios from 'axios';

export const askAI = async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Message requis' });
    return;
  }

  // Check if API key is available
  if (!process.env.OPENROUTER_API_KEY) {
    res.status(503).json({ 
      error: 'Service IA non configuré. Veuillez configurer la clé API OpenRouter.',
      fallback: `Vous avez demandé: "${message}". Le service IA n'est pas encore configuré.`
    });
    return;
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo-16k',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data as { choices: { message: { content: string } }[] };
    res.json({ ai: data.choices[0].message.content });
  } catch (error: any) {
    console.error('Erreur OpenRouter:', error?.response?.data || error.message || error);
    
    // Provide a fallback response for API errors
    res.status(500).json({ 
      error: 'Erreur du service IA',
      fallback: `Désolé, je ne peux pas traiter votre demande "${message}" pour le moment. Veuillez réessayer plus tard.`
    });
  }
}; 