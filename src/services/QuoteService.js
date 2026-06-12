import { GoogleGenerativeAI } from '@google/genai'

class QuoteService {
  constructor() {
    this.genAI = null
    this.model = null
    this.fallbackQuotes = [
      {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
      },
      {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers",
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
    ]
    
    this.initializeAI()
  }

  initializeAI() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey)
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
      } catch (error) {
        console.warn('Failed to initialize Gemini AI:', error)
      }
    }
  }

  async generateQuote(theme = 'productivity') {
    if (!this.model) {
      return this.getFallbackQuote()
    }

    try {
      const prompt = `Generate an inspirational quote about ${theme} and personal growth. 
      Format the response as JSON with 'text' and 'author' fields. 
      The quote should be motivational and suitable for a productivity app.
      If you're creating a fictional author, make it clear it's an inspirational saying.
      Example format: {"text": "Your quote here", "author": "Author Name"}`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Try to parse JSON response
      try {
        const quote = JSON.parse(text)
        if (quote.text && quote.author) {
          return quote
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract quote manually
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length >= 2) {
          return {
            text: lines[0].replace(/^["']|["']$/g, '').trim(),
            author: lines[1].replace(/^-\s*/, '').trim()
          }
        }
      }
      
      // If all parsing fails, return fallback
      return this.getFallbackQuote()
    } catch (error) {
      console.warn('Failed to generate AI quote:', error)
      return this.getFallbackQuote()
    }
  }

  getFallbackQuote() {
    const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length)
    return this.fallbackQuotes[randomIndex]
  }

  async getDailyQuote() {
    // Check if we have a cached quote for today
    const today = new Date().toDateString()
    const cachedQuote = localStorage.getItem('dailyQuote')
    const cachedDate = localStorage.getItem('dailyQuoteDate')
    
    if (cachedQuote && cachedDate === today) {
      try {
        return JSON.parse(cachedQuote)
      } catch (error) {
        console.warn('Failed to parse cached quote:', error)
      }
    }
    
    // Generate new quote for today
    const themes = ['productivity', 'success', 'motivation', 'growth', 'achievement', 'focus']
    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const quote = await this.generateQuote(randomTheme)
    
    // Cache the quote
    localStorage.setItem('dailyQuote', JSON.stringify(quote))
    localStorage.setItem('dailyQuoteDate', today)
    
    return quote
  }

  async getQuotesByTheme(theme, count = 5) {
    const quotes = []
    for (let i = 0; i < count; i++) {
      const quote = await this.generateQuote(theme)
      quotes.push(quote)
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return quotes
  }
}

export default new QuoteService()