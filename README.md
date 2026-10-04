# NutriServe AI

> An AI-powered multi-agent platform integrating Nutrition, Food Safety, Food Science, and Hospitality.

## 🚀 Overview

NutriServe AI is an AI-powered food intelligence platform that provides practical, domain-specific guidance across four interconnected areas:

- 🥗 Nutrition
- 🛡️ Food Safety
- 🔬 Food Science
- 🏨 Hospitality

Unlike a traditional single-agent chatbot, NutriServe AI uses an **AI Orchestrator Agent** to understand the user's question, identify the most relevant domain, and dynamically route the request to a specialized AI agent.

## 🧠 Multi-Agent Architecture

```text
                         USER
                           │
                           ▼
                  🧠 ORCHESTRATOR AGENT
                           │
                  Understands the request
                           │
                           ▼
                  Selects relevant domain
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     🥗 Nutrition    🛡️ Food Safety    🔬 Food Science
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    🏨 Hospitality
                           │
                           ▼
                      AI RESPONSE
                           │
                           ▼
              Analysis + Recommendation
                           │
                           ▼
                         USER
```

## 🤖 AI Agents

### 🧠 Orchestrator Agent

The central routing agent of NutriServe AI.

It analyzes the complete meaning and intent of a user's question and selects the most relevant specialist agent.

### 🥗 Nutrition Agent

Focuses on:

- Calories
- Protein
- Carbohydrates
- Fats
- Vitamins and minerals
- Nutrient composition
- Portion sizes
- Dietary patterns
- General nutrition education

### 🛡️ Food Safety Agent

Focuses on:

- Food storage
- Temperature control
- Foodborne hazards
- Contamination
- Cross-contamination
- Hygiene
- HACCP
- Safe food handling
- Spoilage risks

### 🔬 Food Science Agent

Focuses on:

- Food processing
- Product development
- Formulation
- Shelf-life
- Preservation
- Sensory evaluation
- Food quality
- Food technology
- Natural antimicrobials
- Physicochemical properties

### 🏨 Hospitality Agent

Focuses on:

- Restaurants
- Hotels
- Foodservice
- Guest experience
- Menu operations
- Customer service
- Service quality
- Operational efficiency
- Staff workflow
- Hospitality management

## 🔀 Intelligent Agent Routing

NutriServe AI does not simply match individual keywords.

The Orchestrator evaluates the **overall intent of the user's question** and selects the most relevant specialist.

For example, a question can contain aspects of nutrition, food safety, food science, and hospitality. The Orchestrator determines which domain represents the primary concern and routes the request accordingly.

## 🧪 Example

### User Question

> I run a hotel restaurant and want to serve a new high-protein chicken and barley meal. How can I ensure the chicken is safely stored and prepared, estimate its nutritional value, and maintain good food quality and guest satisfaction?

### Orchestrator Decision

```text
Primary Domain: Food Safety
Selected Agent: Food Safety Agent
```

The selected specialist then provides:

- AI analysis
- Practical recommendation
- Safety guidance

This demonstrates dynamic routing based on the overall meaning of the request.

## 🔄 How It Works

1. The user enters a food-related question.
2. The frontend sends the question to the backend API.
3. The NutriServe AI Orchestrator analyzes the request.
4. The Orchestrator selects the most relevant specialist agent.
5. The selected specialist analyzes the question.
6. The system generates an AI analysis.
7. The system provides a practical recommendation.
8. A safety note is included when relevant.
9. The complete response is displayed on the frontend.

## ⚙️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- CORS
- dotenv

### AI

- Groq API
- OpenAI-compatible API client
- `openai/gpt-oss-20b`

### Deployment

- Netlify — Frontend
- Railway — Backend

## 📁 Project Structure

```text
NutriServe AI/
│
├── assets/
│
├── server/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

> The `.env` file contains private API credentials and is excluded from the public GitHub repository.

## 🌐 Live Demo

**Frontend:**  
https://strong-haupia-199116.netlify.app/

**Backend:**  
https://nutriserve-ai-production.up.railway.app/

## 🔐 Security

API credentials are stored using environment variables and are not included in the public repository.

The frontend communicates with the backend API instead of exposing the AI API key in browser-side JavaScript.

## 🎯 Project Goal

NutriServe AI demonstrates how an **AI-agent workflow can integrate multiple food-related domains into one intelligent platform**.

The project aims to make food-related decision support more structured by allowing an orchestrator to determine which specialist perspective is most relevant to each request.

## 🌟 Key Features

- Multi-agent AI architecture
- Intelligent domain routing
- Nutrition analysis
- Food safety assessment
- Food science guidance
- Hospitality recommendations
- AI-generated recommendations
- Safety-focused responses
- Responsive web interface
- Live cloud deployment

## 👩‍💻 Project

**NutriServe AI**

An AI-agent-based food intelligence platform integrating:

**Nutrition × Food Safety × Food Science × Hospitality**