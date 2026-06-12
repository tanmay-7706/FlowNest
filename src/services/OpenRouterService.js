const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/**
 * OpenRouterService — reverted to client-side fetching because
 * Firebase Cloud Functions require a Blaze (pay-as-you-go) plan.
 */
class OpenRouterService {
  /**
   * Generic request to OpenRouter API.
   * @param {Array} messages - Chat messages array.
   * @param {Object} options - Options like temperature, maxTokens.
   * @returns {Object} - Parsed response from the AI.
   */
  async makeRequest(messages, options = {}) {
    if (!OPENROUTER_API_KEY) {
      console.warn("OpenRouter API key is missing.");
      throw new Error("API Key missing");
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "FlowNest",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500,
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("OpenRouter AI request failed:", error);
      throw new Error("AI service unavailable. Please try again later.");
    }
  }

  // AI-Powered Motivational Quotes
  async generateMotivationalQuote(userContext = {}) {
    const { mood, goals, recentActivity } = userContext;

    const messages = [
      {
        role: "system",
        content: `You are an AI productivity coach. Generate personalized motivational quotes based on user context. 
        Return ONLY a JSON object with 'text' and 'author' fields. Make the author "AI Coach" for generated quotes.`,
      },
      {
        role: "user",
        content: `Generate a motivational quote for someone with:
        - Current mood: ${mood || "focused"}
        - Goals: ${goals || "general productivity"}
        - Recent activity: ${recentActivity || "working on tasks"}
        
        Make it personal and inspiring.`,
      },
    ];

    try {
      const response = await this.makeRequest(messages, { temperature: 0.8 });
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      return {
        text: "Every small step forward is progress worth celebrating.",
        author: "AI Coach",
      };
    }
  }

  // AI Task Prioritization
  async prioritizeTasks(tasks, userPreferences = {}) {
    const messages = [
      {
        role: "system",
        content: `You are an AI productivity expert. Analyze tasks and return prioritization suggestions.
        Return JSON array with task IDs and priority scores (1-10), plus reasoning.`,
      },
      {
        role: "user",
        content: `Prioritize these tasks based on urgency, importance, and user preferences:
        Tasks: ${JSON.stringify(tasks)}
        User preferences: ${JSON.stringify(userPreferences)}
        
        Return format: {"prioritized": [{"id": "task_id", "priority": 8, "reason": "explanation"}]}`,
      },
    ];

    try {
      const response = await this.makeRequest(messages);
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      return { prioritized: [] };
    }
  }

  // AI Productivity Insights
  async generateProductivityInsights(analyticsData) {
    const messages = [
      {
        role: "system",
        content: `You are an AI productivity analyst. Analyze user data and provide actionable insights.
        Return JSON with insights array containing type, title, message, and actionable recommendations.`,
      },
      {
        role: "user",
        content: `Analyze this productivity data and provide insights:
        ${JSON.stringify(analyticsData)}
        
        Focus on patterns, improvements, and specific actionable advice.`,
      },
    ];

    try {
      const response = await this.makeRequest(messages);
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      return { insights: [] };
    }
  }

  // AI Goal Breakdown
  async breakdownGoal(goal) {
    const messages = [
      {
        role: "system",
        content: `You are an AI goal strategist. Break down large goals into actionable steps.
        Return JSON with steps array, timeline, and success metrics.`,
      },
      {
        role: "user",
        content: `Break down this goal into actionable steps:
        Goal: ${goal}
        
        Provide realistic timeline and measurable milestones.`,
      },
    ];

    try {
      const response = await this.makeRequest(messages);
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      return { steps: [], timeline: "", metrics: [] };
    }
  }

  // AI Habit Recommendations
  async recommendHabits(userProfile, currentHabits) {
    const messages = [
      {
        role: "system",
        content: `You are an AI habit coach. Recommend personalized habits based on user profile and goals.
        Return JSON with recommended habits, difficulty levels, and implementation strategies.`,
      },
      {
        role: "user",
        content: `Recommend habits for this user:
        Profile: ${JSON.stringify(userProfile)}
        Current habits: ${JSON.stringify(currentHabits)}
        
        Focus on complementary habits that build on existing ones.`,
      },
    ];

    try {
      const response = await this.makeRequest(messages);
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      return { recommendations: [] };
    }
  }

  // AI Meeting Summary & Action Items
  async analyzeMeetingNotes(notes) {
    const messages = [
      {
        role: "system",
        content: `You are an AI meeting analyst. Extract key points, action items, and follow-ups from meeting notes.
        Return JSON with summary, actionItems, and nextSteps.`,
      },
      {
        role: "user",
        content: `Analyze these meeting notes and extract actionable insights:
        ${notes}`,
      },
    ];

    try {
      const response = await this.makeRequest(messages);
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      return { summary: "", actionItems: [], nextSteps: [] };
    }
  }

  // AI Time Optimization
  async optimizeSchedule(schedule, preferences) {
    const messages = [
      {
        role: "system",
        content: `You are an AI time management expert. Optimize schedules for maximum productivity.
        Return JSON with optimized schedule and efficiency tips.`,
      },
      {
        role: "user",
        content: `Optimize this schedule:
        Current schedule: ${JSON.stringify(schedule)}
        Preferences: ${JSON.stringify(preferences)}
        
        Focus on energy levels, task batching, and break optimization.`,
      },
    ];

    try {
      const response = await this.makeRequest(messages);
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch {
      return { optimized: schedule, tips: [] };
    }
  }
}

export default new OpenRouterService();