// utils/callTogether.ts
import Together from 'together-ai';

const together = new Together({
  apiKey: '27b0fa6f90b3439c518ffeaf3458bffeeb2a679078fe244423150a6bbc916152', // replace with your actual API key
});

export const callTogether = async (prompt: string): Promise<string> => {
  try {
    const response = await together.chat.completions.create({
      model: 'meta-llama/Llama-3-8b-chat-hf', // Better instruction following model
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.choices?.[0]?.message?.content || 'Together returned an empty response.';
  } catch (error) {
    console.error('Together.ai API error:', error);
    return 'Error: Could not fetch response from Together.ai.';
  }
};


