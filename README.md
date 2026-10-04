# NutriServe AI

> An AI-powered multi-agent platform integrating Nutrition, Food Safety, Food Science, and Hospitality.

## 🚀 Overview

NutriServe AI is an AI-powered food intelligence platform designed to provide practical and domain-specific guidance across four interconnected areas:

- 🥗 Nutrition
- 🛡️ Food Safety
- 🔬 Food Science
- 🏨 Hospitality

Instead of using a single generic chatbot, NutriServe AI uses an **AI Orchestrator Agent** that understands the user's question, identifies the most relevant domain, and dynamically routes the request to a specialized AI agent.

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
             Selects the best domain
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
   🥗 Nutrition   🛡️ Food Safety   🔬 Food Science
       │              │              │
       └──────────────┼──────────────┘
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
The central routing agent. It analyzes the complete meaning of a user's question and selects the most relevant specialist.

### 🥗 Nutrition Agent
Focuses on:

- Calories
- Protein
- Carbohydrates
- Fats
- Vitamins and minerals
- Portion sizes
- Dietary composition
- General nutrition guidance

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

## 🔀 Intelligent Routing

NutriServe AI does not simply select an agent based on individual keywords.

The Orchestrator evaluates the **overall intent of the user's question** and selects the most relevant specialist.

For example, a question containing nutrition, food safety, food science, and hospitality aspects may still be routed to one primary specialist based on the main concern.

## 🧪 Example

**User:**

> I run a hotel restaurant and want to serve a new high-protein chicken and barley meal. How can I ensure the chicken is safely stored and prepared, estimate its nutritional value, and maintain good food quality and guest satisfaction?

**Orchestrator Decision:**

```text
Primary Domain: Food Safety
Selected Agent: Food Safety Agent
```

The Food Safety Agent then provides analysis and practical recommendations while considering the other aspects of the request.

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
├── css/
├── js/
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

> `.env` is excluded from GitHub and is used only for the private API key.

## 🔄 How It Works

1. User enters a food-related question.
2. The frontend sends the question to the backend API.
3. The NutriServe Orchestrator analyzes the request.
4. The Orchestrator selects one specialist agent.
5. The selected specialist analyzes the question.
6. The system generates:
   - AI Analysis
   - Practical Recommendation
   - Safety Note
7. The response is displayed on the frontend.

## 🌐 Live Demo

**Frontend:**  
https://strong-haupia-199116.netlify.app/

**Backend:**  
https://nutriserve-ai-production.up.railway.app/

## 🔐 Security

API credentials are stored using environment variables and are not included in the public repository.

The frontend communicates with the backend API rather than exposing the AI API key in browser-side JavaScript.

## 🎯 Project Goal

NutriServe AI demonstrates how an **AI-agent workflow can combine multiple food-related domains into one intelligent platform**.

The goal is to make food-related decision support more structured by allowing an orchestrator to determine which specialist perspective is most relevant to each request.

## 👩‍💻 Project

**NutriServe AI**

Developed as an AI-agent-based food intelligence platform integrating:

**Nutrition × Food Safety × Food Science × Hospitality**
