'use server';

// Frontend actions that communicate with the backend API server

export interface GenerateGigTagsInput {
  title: string;
  description: string;
  category: string;
}

export interface GenerateGigDescriptionInput {
  title: string;
  category: string;
  price: number;
  deliveryTime: number;
}

export interface SupportChatInput {
  message: string;
  context?: string;
}

export interface RecommendGigsInput {
  userPreferences: string[];
  recentOrders: string[];
}

export interface TranslateTextInput {
  text: string;
  targetLanguage: string;
}

// These functions would typically make HTTP requests to your backend API
// For now, we'll provide mock implementations or direct calls if the backend is accessible

export async function generateTagsAction(input: GenerateGigTagsInput): Promise<string[]> {
  try {
    // In a real implementation, this would make an HTTP request to your backend
    // For now, return mock data or implement the logic directly
    const response = await fetch('https://freelancer-server-9l9n.onrender.com/api/generate-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.tags || [];
    }
    
    // Fallback: generate simple tags based on title and category
    const words = input.title.toLowerCase().split(' ');
    const categoryTag = input.category.toLowerCase().replace(/\s+/g, '-');
    return [categoryTag, ...words.slice(0, 3)].filter(tag => tag.length > 2);
  } catch (error) {
    console.error("Error generating tags:", error);
    // Fallback tags
    return [input.category.toLowerCase().replace(/\s+/g, '-'), 'professional', 'quality'];
  }
}

export async function generateDescriptionAction(input: GenerateGigDescriptionInput): Promise<string> {
  try {
    // In a real implementation, this would make an HTTP request to your backend
    const response = await fetch('https://freelancer-server-9l9n.onrender.com/api/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.description || `Professional ${input.category.toLowerCase()} service for "${input.title}". High-quality work delivered in ${input.deliveryTime} days for $${input.price}.`;
    }
    
    // Fallback description
    return `Professional ${input.category.toLowerCase()} service for "${input.title}". High-quality work delivered in ${input.deliveryTime} days for $${input.price}.`;
  } catch (error) {
    console.error("Error generating description:", error);
    return `Professional ${input.category.toLowerCase()} service. High-quality work delivered on time.`;
  }
}

export async function generateImageAction(title: string): Promise<string | { error: string }> {
  try {
    // In a real implementation, this would make an HTTP request to your backend
    const response = await fetch('https://freelancer-server-9l9n.onrender.com/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.imageDataUri || `https://placehold.co/600x400.png?text=${encodeURIComponent(title)}`;
    }
    
    // Fallback: return a placeholder image
    return `https://placehold.co/600x400.png?text=${encodeURIComponent(title)}`;
  } catch (error) {
    console.error("Error generating image:", error);
    return { error: "Failed to generate image. Please try again." };
  }
}

export async function supportChatAction(input: SupportChatInput): Promise<string> {
  try {
    // In a real implementation, this would make an HTTP request to your backend
    const response = await fetch('https://freelancer-server-9l9n.onrender.com/api/support-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.response || "Thank you for your message. Our support team will get back to you soon.";
    }
    
    // Fallback response
    return "Thank you for your message. Our support team will get back to you soon.";
  } catch (error) {
    console.error("Error in support chat:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export async function recommendGigsAction(input: RecommendGigsInput): Promise<string[]> {
  try {
    // In a real implementation, this would make an HTTP request to your backend
    const response = await fetch('https://freelancer-server-9l9n.onrender.com/api/recommend-gigs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.recommendations || [];
    }
    
    // Fallback: return empty recommendations
    return [];
  } catch (error) {
    console.error("Error recommending gigs:", error);
    return [];
  }
}

export async function translateTextAction(input: TranslateTextInput): Promise<string> {
  try {
    // In a real implementation, this would make an HTTP request to your backend
    const response = await fetch('https://freelancer-server-9l9n.onrender.com/api/translate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.translation || input.text;
    }
    
    // Fallback: return original text
    return input.text;
  } catch (error) {
    console.error("Error translating text:", error);
    return `Error: Could not translate to ${input.targetLanguage}.`;
  }
}