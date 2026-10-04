const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const MODEL = "openai/gpt-oss-20b";


// ==========================================
// SPECIALIST AGENT PROMPTS
// ==========================================

const specialistPrompts = {

    nutrition: `
You are the NutriServe Nutrition Specialist Agent.

Focus on:
- calories
- protein
- carbohydrates
- fats
- vitamins
- minerals
- dietary patterns
- nutrient composition
- portion sizes
- general nutrition education

Analyze the user's question from a nutrition perspective.

Provide practical, evidence-based general guidance.

Use approximate values when exact nutritional information is not available.

Clearly state when nutritional values can vary based on food type, portion size, preparation method, or ingredients.

Do not diagnose medical conditions.

For medical nutrition concerns, recommend consultation with a qualified professional.
`,

    food_safety: `
You are the NutriServe Food Safety Specialist Agent.

Focus on:
- food safety
- foodborne hazards
- contamination
- bacteria
- storage
- temperature control
- hygiene
- HACCP
- spoilage
- safe food handling
- cross-contamination

Analyze the user's question from a food safety perspective.

IMPORTANT FOOD SAFETY RULES:

1. Prioritize time and temperature control when evaluating whether food is safe.

2. Do not use smell, appearance, color, or texture alone to determine whether food is safe.

3. Food can contain harmful microorganisms without showing visible or sensory signs of spoilage.

4. If food has been stored at unsafe temperatures, left out too long, or the storage history is uncertain, recommend discarding it.

5. Reheating can kill many bacteria when food is properly reheated, but reheating does not make improperly stored, spoiled, or contaminated food safe.

6. Do not suggest that reheating can make unsafe food safe.

7. For properly stored leftovers, provide appropriate reheating guidance when relevant.

8. When discussing cooked leftovers, consider refrigerator temperature, storage duration, cooling time, and whether the food was left at room temperature.

9. If storage conditions are unknown and the food is potentially high-risk, prioritize the safer option of discarding it.

10. Do not tell users that normal smell, appearance, color, or texture proves that food is safe.

Provide practical, evidence-based general food safety guidance.

Do not diagnose medical conditions.

For suspected foodborne illness or serious symptoms, recommend seeking appropriate medical care.
`,

    food_science: `
You are the NutriServe Food Science Specialist Agent.

Focus on:
- food processing
- formulation
- product development
- shelf life
- preservation
- sensory evaluation
- food quality
- food technology
- natural antimicrobials
- physicochemical properties
- food structure
- processing conditions

Analyze the user's question scientifically and explain relevant food science principles.

Provide practical and scientifically grounded explanations.

When experimental validation would be required, clearly state that laboratory or controlled testing may be necessary.

Do not claim that a product has a specific shelf life without appropriate validation.
`,

    hospitality: `
You are the NutriServe Hospitality Specialist Agent.

Focus on:
- restaurants
- hotels
- foodservice
- guest experience
- menu operations
- customer service
- hospitality management
- service quality
- operational efficiency
- staff training
- foodservice workflow

Analyze the user's question from a hospitality and foodservice perspective.

Provide practical recommendations that can be applied in real foodservice environments.

Consider operational efficiency, food safety, service quality, customer experience, and staff workflow when relevant.
`
};


// ==========================================
// SAFE JSON PARSER
// ==========================================

function parseAIJson(text) {

    if (!text || typeof text !== "string") {
        throw new Error("AI returned an empty response.");
    }

    let cleaned = text.trim();

    // Remove Markdown code fences if the model adds them
    cleaned = cleaned.replace(/^```json\s*/i, "");
    cleaned = cleaned.replace(/^```\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");

    cleaned = cleaned.trim();

    // First parsing attempt
    try {

        return JSON.parse(cleaned);

    } catch (firstError) {

        console.log("⚠️ First JSON parsing attempt failed.");

    }

    // Try to extract the JSON object
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (
        firstBrace !== -1 &&
        lastBrace !== -1 &&
        lastBrace > firstBrace
    ) {

        const possibleJson =
            cleaned.substring(
                firstBrace,
                lastBrace + 1
            );

        try {

            return JSON.parse(possibleJson);

        } catch (secondError) {

            console.log(
                "⚠️ JSON extraction attempt also failed."
            );

        }
    }

    throw new Error(
        "AI returned an invalid or incomplete JSON response."
    );
}


// ==========================================
// ORCHESTRATOR AGENT
// ==========================================

async function runOrchestrator(question) {

    const orchestratorPrompt = `
You are the NutriServe AI Orchestrator.

Your job is to understand the user's complete question and select ONE specialist agent.

Available agents:

1. Nutrition Agent
2. Food Safety Agent
3. Food Science Agent
4. Hospitality Agent

Routing rules:

Nutrition:
Nutrition, calories, protein, vitamins, minerals,
diet, nutrients, dietary patterns, portion sizes.

Food Safety:
Food safety, storage, contamination, bacteria,
temperature, hygiene, HACCP, spoilage,
foodborne risk, cross-contamination,
safe food handling.

Food Science:
Processing, formulation, product development,
shelf life, preservation, sensory evaluation,
food quality, food technology, natural antimicrobials,
food structure and physicochemical properties.

Hospitality:
Restaurants, hotels, foodservice, kitchens,
guest experience, menu operations, customer service,
hospitality management, service quality,
operational efficiency.

IMPORTANT:

Understand the complete meaning of the question.

If a question contains multiple domains, select the ONE
specialist that addresses the primary safety, operational,
or decision-making concern.

For example:

A question asking about the protein in chicken AND whether
stored chicken is safe to eat should normally be routed to
Food Safety because the safety decision is the primary concern.

A question asking only for protein or calories should be
routed to Nutrition.

A question about product formulation or shelf-life development
should be routed to Food Science.

A question about restaurant or hotel operations should be
routed to Hospitality.

Return ONLY valid JSON.

The JSON must have exactly these four fields:

{
    "domain": "Nutrition | Food Safety | Food Science | Hospitality",
    "agent": "Nutrition Agent | Food Safety Agent | Food Science Agent | Hospitality Agent",
    "agent_key": "nutrition | food_safety | food_science | hospitality",
    "reason": "Why this specialist was selected"
}

Do not use Markdown.

Do not add any text before or after the JSON.

Make sure the JSON is complete and valid.
`;

    // First attempt
    try {

        const response =
            await client.chat.completions.create({

                model: MODEL,

                messages: [

                    {
                        role: "system",
                        content: orchestratorPrompt
                    },

                    {
                        role: "user",
                        content: question
                    }

                ],

                temperature: 0.1,

                max_tokens: 300
            });

        const text =
            response.choices?.[0]?.message?.content || "";

        console.log(
            "🧠 Orchestrator raw response:",
            text
        );

        return parseAIJson(text);

    } catch (error) {

        console.log(
            "⚠️ Orchestrator first attempt failed:",
            error.message
        );

        // Retry once
        console.log(
            "🔄 Retrying Orchestrator..."
        );

        const retryResponse =
            await client.chat.completions.create({

                model: MODEL,

                messages: [

                    {
                        role: "system",
                        content: orchestratorPrompt
                    },

                    {
                        role: "user",
                        content:
                            `Route this question to exactly one specialist and return only valid JSON:\n\n${question}`
                    }

                ],

                temperature: 0,

                max_tokens: 300
            });

        const retryText =
            retryResponse.choices?.[0]?.message?.content || "";

        console.log(
            "🧠 Orchestrator retry response:",
            retryText
        );

        return parseAIJson(retryText);
    }
}


// ==========================================
// SPECIALIST AGENT
// ==========================================

async function runSpecialistAgent(question, routing) {

    const specialistPrompt =
        specialistPrompts[routing.agent_key];

    if (!specialistPrompt) {

        throw new Error(
            `Unknown specialist agent: ${routing.agent_key}`
        );
    }

    const response =
        await client.chat.completions.create({

            model: MODEL,

            messages: [

                {
                    role: "system",

                    content: `
${specialistPrompt}

Return ONLY valid JSON using exactly:

{
    "analysis": "Detailed but concise analysis of the question.",
    "recommendation": "Practical recommendation for the user.",
    "safety_note": "Safety limitation or note when relevant."
}

For food safety questions, prioritize time and temperature control.

For food safety questions, never state or imply that normal smell, appearance, color, or texture proves that food is safe.

For food safety questions, do not recommend reheating as a way to rescue food that was improperly stored or kept at unsafe temperatures.

Do not use Markdown.

Do not add text outside the JSON.

Make sure the JSON is complete and valid.
`
                },

                {
                    role: "user",
                    content: question
                }

            ],

            temperature: 0.2,

            max_tokens: 1000
        });

    const text =
        response.choices?.[0]?.message?.content || "";

    console.log(
        "🤖 Specialist raw response:",
        text
    );

    return parseAIJson(text);
}


// ==========================================
// API ENDPOINT
// ==========================================

app.post("/api/analyze", async (req, res) => {

    try {

        const { question } = req.body;

        if (!question || question.trim() === "") {

            return res.status(400).json({

                error:
                    "Please provide a food-related question."

            });
        }

        console.log("");
        console.log(
            "=========================================="
        );
        console.log(
            "NEW NUTRISERVE AI REQUEST"
        );
        console.log(
            "=========================================="
        );

        console.log(
            "Question:",
            question
        );

        console.log("");
        console.log(
            "🧠 Orchestrator Agent working..."
        );

        const routing =
            await runOrchestrator(question);

        console.log(
            "🎯 Selected Agent:",
            routing.agent
        );

        console.log(
            "📌 Domain:",
            routing.domain
        );

        console.log("");
        console.log(
            "🤖",
            routing.agent,
            "working..."
        );

        const specialist =
            await runSpecialistAgent(
                question,
                routing
            );

        console.log(
            "✅ Specialist analysis completed."
        );

        res.json({

            domain:
                routing.domain,

            agent:
                routing.agent,

            reason:
                routing.reason,

            analysis:
                specialist.analysis,

            recommendation:
                specialist.recommendation,

            safety_note:
                specialist.safety_note

        });

        console.log("");
        console.log(
            "✅ NutriServe AI request completed."
        );

        console.log(
            "=========================================="
        );
        console.log("");

    } catch (error) {

        console.error("");
        console.error(
            "❌ NutriServe AI Error:",
            error
        );

        res.status(500).json({

            error:
                "NutriServe AI could not process the request.",

            details:
                error.message

        });
    }
});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {

    res.json({

        project:
            "NutriServe AI",

        status:
            "Multi-Agent Backend Running",

        ai_provider:
            "Groq",

        architecture:
            "Orchestrator + Specialist Agent",

        endpoint:
            "/api/analyze"

    });
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(`
==========================================
        NUTRISERVE AI
        MULTI-AGENT BACKEND
==========================================

Server:
http://localhost:${PORT}

AI Endpoint:
http://localhost:${PORT}/api/analyze

AI Provider:
Groq

Architecture:
Orchestrator + Specialist Agents

Status:
Running

==========================================
`);

});