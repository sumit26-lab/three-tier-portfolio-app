import { type User, type InsertUser, type Article, type InsertArticle, type UpdateArticle } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article operations
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticles(options?: { published?: boolean; category?: string; limit?: number; offset?: number }): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: UpdateArticle): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getCategories(): Promise<string[]>;
  getAllTags(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    
    // Add some sample articles for testing
    this.initializeSampleArticles();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Article operations
  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
  }

  async getArticles(options: { published?: boolean; category?: string; limit?: number; offset?: number } = {}): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (options.published !== undefined) {
      articles = articles.filter(article => article.published === options.published);
    }
    
    if (options.category) {
      articles = articles.filter(article => article.category === options.category);
    }
    
    // Sort by creation date (newest first)
    articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const offset = options.offset || 0;
    const limit = options.limit || articles.length;
    
    return articles.slice(offset, offset + limit);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = { 
      ...insertArticle,
      id,
      tags: insertArticle.tags || [],
      published: insertArticle.published || false,
      createdAt: now,
      updatedAt: now
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updates: UpdateArticle): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle: Article = {
      ...article,
      ...updates,
      updatedAt: new Date()
    };
    
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    Array.from(this.articles.values()).forEach(article => {
      categories.add(article.category);
    });
    return Array.from(categories).sort();
  }

  async getAllTags(): Promise<string[]> {
    const tags = new Set<string>();
    Array.from(this.articles.values()).forEach(article => {
      article.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  private initializeSampleArticles() {
    // Sample articles based on user's background
    const sampleArticles: Article[] = [
      {
        id: randomUUID(),
        title: "Understanding Food Inflation in India: Economic Perspectives",
        slug: "understanding-food-inflation-india-economic-perspectives",
        summary: "An analysis of the economic factors contributing to food inflation in India and their impact on the general population.",
        content: `# Understanding Food Inflation in India: Economic Perspectives

Food inflation has been a persistent challenge in India's economic landscape. This article explores the multifaceted causes and potential solutions to address this critical issue.

## Key Factors Contributing to Food Inflation

### Supply-Side Constraints
- Agricultural productivity challenges
- Infrastructure limitations
- Weather dependency and climate change impacts

### Demand-Side Pressures
- Growing population and changing consumption patterns
- Rising income levels and dietary shifts
- Export demands affecting domestic supply

## Policy Recommendations

Based on economic analysis, several policy interventions can help mitigate food inflation:

1. **Investment in Agricultural Infrastructure**
   - Improved storage facilities
   - Better transportation networks
   - Technology adoption in farming

2. **Market Reforms**
   - Enhanced price discovery mechanisms
   - Reduced intermediation
   - Direct farmer-to-consumer channels

3. **Sustainable Agriculture Practices**
   - Climate-resilient crop varieties
   - Water conservation techniques
   - Integrated pest management

## Conclusion

Addressing food inflation requires a comprehensive approach combining supply-side improvements with demand management. Sustainable solutions must consider both immediate relief measures and long-term structural reforms.`,
        category: "Economics",
        tags: ["Food Inflation", "Indian Economy", "Agricultural Policy", "Economic Analysis"],
        published: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: randomUUID(),
        title: "The Ukraine War's Impact on Global Food Security",
        slug: "ukraine-war-impact-global-food-security",
        summary: "Examining how the geopolitical conflict in Ukraine has disrupted global food supply chains and contributed to worldwide inflation.",
        content: `# The Ukraine War's Impact on Global Food Security

The conflict in Ukraine has far-reaching consequences beyond its borders, significantly affecting global food security and contributing to worldwide inflationary pressures.

## Ukraine and Russia's Role in Global Food Markets

Both Ukraine and Russia are major exporters of:
- Wheat and other grains
- Sunflower oil
- Fertilizers

The disruption of these exports has created ripple effects across global markets.

## Immediate Impacts

### Supply Chain Disruptions
- Port blockades affecting grain exports
- Reduced agricultural production in conflict zones
- Transportation route disruptions

### Price Volatility
- Commodity price spikes in international markets
- Increased costs for importing nations
- Food security concerns in vulnerable regions

## Long-term Implications

The conflict has highlighted the fragility of global food systems and the need for:
- Diversified supply sources
- Strategic food reserves
- Resilient agricultural systems

## Lessons for India

India can learn from this crisis by:
1. Strengthening domestic food production
2. Building strategic reserves
3. Developing alternative supply chains
4. Investing in agricultural self-sufficiency

This crisis underscores the importance of food sovereignty and the interconnected nature of global markets.`,
        category: "Global Economics",
        tags: ["Ukraine War", "Food Security", "Global Trade", "Geopolitics", "Supply Chain"],
        published: true,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20')
      },
      {
        id: randomUUID(),
        title: "Effective Communication in Academic Settings",
        slug: "effective-communication-academic-settings",
        summary: "Best practices for enhancing communication skills in educational environments, based on teaching experience.",
        content: `# Effective Communication in Academic Settings

Drawing from my experience as an Assistant Professor, effective communication is fundamental to successful teaching and student engagement.

## Key Principles of Academic Communication

### Clarity and Structure
- Organize content logically
- Use clear, accessible language
- Provide visual aids and examples

### Active Engagement
- Encourage student participation
- Use interactive teaching methods
- Create inclusive classroom environments

### Feedback and Assessment
- Provide constructive feedback
- Regular assessment checkpoints
- Peer learning opportunities

## Developing Student Communication Skills

### Practical Approaches
1. **Debate and Discussion Forums**
   - Structured debates on relevant topics
   - Small group discussions
   - Presentation opportunities

2. **Writing Workshops**
   - Academic writing skills
   - Research methodology
   - Citation and referencing

3. **Public Speaking Training**
   - Confidence building exercises
   - Presentation techniques
   - Audience engagement strategies

## Building Professional Networks

Communication extends beyond the classroom:
- Professional conferences and seminars
- Collaborative research projects
- Industry partnerships

## Conclusion

Effective communication is a cornerstone of academic success, benefiting both educators and students in their professional development journey.`,
        category: "Education",
        tags: ["Communication Skills", "Teaching", "Academic Writing", "Student Development"],
        published: true,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10')
      }
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
    });
  }
}

export const storage = new MemStorage();
