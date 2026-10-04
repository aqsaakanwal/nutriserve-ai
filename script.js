const API_URL = "https://nutriserve-ai-production.up.railway.app/api/analyze";

document.addEventListener("DOMContentLoaded", () => {

    const questionInput = document.getElementById("questionInput");
    const analyzeButton = document.getElementById("analyzeButton");
    const agentResult = document.getElementById("agentResult");
    const agentWorkflow = document.getElementById("agentWorkflow");

    const exampleQuestions =
        document.querySelectorAll(".example-question");

    const quickQuestions =
        document.querySelectorAll(".quick-question");


    /*
    ============================================================
    AGENT CONFIGURATION
    ============================================================
    */

    const agentConfig = {

        "Nutrition Agent": {
            icon: "🥗",
            className: "nutrition",
            label: "Nutrition Agent",
            title: "Nutrition Analysis",
            description:
                "Analyzing calories, nutrients, dietary composition, and practical nutrition considerations."
        },

        "Food Safety Agent": {
            icon: "🛡️",
            className: "safety",
            label: "Food Safety Agent",
            title: "Food Safety Analysis",
            description:
                "Evaluating storage, contamination risks, temperature control, hygiene, and safe food handling."
        },

        "Food Science Agent": {
            icon: "🔬",
            className: "science",
            label: "Food Science Agent",
            title: "Food Science Analysis",
            description:
                "Evaluating processing, formulation, food quality, shelf life, preservation, and product development."
        },

        "Hospitality Agent": {
            icon: "🏨",
            className: "hospitality",
            label: "Hospitality Agent",
            title: "Hospitality Analysis",
            description:
                "Evaluating foodservice operations, guest experience, kitchen workflow, and service quality."
        }

    };


    /*
    ============================================================
    HELPER FUNCTIONS
    ============================================================
    */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatText(value) {

        if (!value) {
            return "";
        }

        return escapeHTML(value)
            .replace(/\n\n/g, "<br><br>")
            .replace(/\n/g, "<br>");
    }


    function getAgentConfig(agentName) {

        return agentConfig[agentName] || {

            icon: "🤖",
            className: "default",
            label: agentName || "AI Specialist Agent",
            title: "AI Analysis",
            description:
                "Analyzing your food-related question using NutriServe AI."
        };

    }


    /*
    ============================================================
    WORKFLOW DISPLAY
    ============================================================
    */

    function showWorkflow(agentName) {

        if (!agentWorkflow) {
            return;
        }

        const config = getAgentConfig(agentName);

        agentWorkflow.innerHTML = `

            <div class="workflow-step active">

                <div class="workflow-icon">
                    🧠
                </div>

                <div class="workflow-content">

                    <span class="workflow-label">
                        ORCHESTRATOR
                    </span>

                    <strong>
                        NutriServe AI Orchestrator
                    </strong>

                    <p>
                        Understanding your question and selecting the most relevant specialist.
                    </p>

                </div>

            </div>


            <div class="workflow-connector"></div>


            <div class="workflow-step active">

                <div class="workflow-icon">
                    ${config.icon}
                </div>

                <div class="workflow-content">

                    <span class="workflow-label">
                        SPECIALIST AGENT
                    </span>

                    <strong>
                        ${escapeHTML(config.label)}
                    </strong>

                    <p>
                        ${escapeHTML(config.description)}
                    </p>

                </div>

            </div>


            <div class="workflow-connector"></div>


            <div class="workflow-step active">

                <div class="workflow-icon">
                    ✨
                </div>

                <div class="workflow-content">

                    <span class="workflow-label">
                        AI RECOMMENDATION
                    </span>

                    <strong>
                        Generating food intelligence
                    </strong>

                    <p>
                        Preparing an evidence-based response and practical recommendation.
                    </p>

                </div>

            </div>

        `;

        agentWorkflow.style.display = "block";
    }


    /*
    ============================================================
    LOADING STATE
    ============================================================
    */

    function showLoading() {

        if (!agentResult) {
            return;
        }

        agentResult.style.display = "block";

        agentResult.className =
            "agent-result loading-result";

        agentResult.innerHTML = `

            <div class="result-loading">

                <div class="loading-orbit">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

                <div class="loading-text">

                    <strong>
                        NutriServe AI is thinking...
                    </strong>

                    <p>
                        The orchestrator is selecting the best specialist agent.
                    </p>

                </div>

            </div>

        `;
    }


    /*
    ============================================================
    ERROR STATE
    ============================================================
    */

    function showError(message) {

        if (!agentResult) {
            return;
        }

        agentResult.style.display = "block";

        agentResult.className =
            "agent-result error-result";

        agentResult.innerHTML = `

            <div class="result-error">

                <div class="error-icon">
                    ⚠️
                </div>

                <div>

                    <h3>
                        NutriServe AI could not complete the analysis
                    </h3>

                    <p>
                        ${escapeHTML(message)}
                    </p>

                    <small>
                        Please try again in a moment.
                    </small>

                </div>

            </div>

        `;
    }


    /*
    ============================================================
    RESULT DISPLAY
    ============================================================
    */

    function displayResult(data) {

        if (!agentResult) {
            return;
        }

        const config =
            getAgentConfig(data.agent);

        agentResult.style.display = "block";

        agentResult.className =
            `agent-result ${config.className}-result`;

        agentResult.innerHTML = `

            <div class="result-header">

                <div class="result-agent-icon">

                    ${config.icon}

                </div>

                <div class="result-agent-info">

                    <span class="result-eyebrow">

                        SPECIALIST SELECTED

                    </span>

                    <h3>

                        ${escapeHTML(data.agent || config.label)}

                    </h3>

                    <p>

                        ${escapeHTML(data.domain || config.title)}

                    </p>

                </div>

            </div>


            <div class="result-routing">

                <div class="routing-item">

                    <span>
                        🎯
                    </span>

                    <div>

                        <small>
                            SELECTED DOMAIN
                        </small>

                        <strong>
                            ${escapeHTML(data.domain || "Food Intelligence")}
                        </strong>

                    </div>

                </div>


                <div class="routing-item">

                    <span>
                        🧠
                    </span>

                    <div>

                        <small>
                            AGENT
                        </small>

                        <strong>
                            ${escapeHTML(data.agent || "Specialist Agent")}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="result-reason">

                <div class="result-section-icon">
                    💡
                </div>

                <div>

                    <h4>
                        Why this agent?
                    </h4>

                    <p>
                        ${formatText(data.reason)}
                    </p>

                </div>

            </div>


            <div class="result-analysis">

                <div class="result-section-icon">
                    🔎
                </div>

                <div>

                    <h4>
                        AI Analysis
                    </h4>

                    <p>
                        ${formatText(data.analysis)}
                    </p>

                </div>

            </div>


            <div class="result-recommendation">

                <div class="result-section-icon">
                    ✨
                </div>

                <div>

                    <h4>
                        Recommendation
                    </h4>

                    <p>
                        ${formatText(data.recommendation)}
                    </p>

                </div>

            </div>


            ${data.safety_note
                ?
                `
                    <div class="result-safety">

                        <div class="result-section-icon">
                            🛡️
                        </div>

                        <div>

                            <h4>
                                Safety Note
                            </h4>

                            <p>
                                ${formatText(data.safety_note)}
                            </p>

                        </div>

                    </div>
                `
                :
                ""
            }

        `;

        agentResult.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    /*
    ============================================================
    MAIN AI ANALYSIS
    ============================================================
    */

    async function analyzeQuestion() {

        if (!questionInput || !analyzeButton) {
            return;
        }

        const question =
            questionInput.value.trim();

        if (!question) {

            questionInput.focus();

            showError(
                "Please enter a food-related question first."
            );

            return;
        }


        analyzeButton.disabled = true;

        analyzeButton.classList.add("loading");

        analyzeButton.innerHTML = `
            <span>🤖</span>
            Analyzing...
        `;


        showLoading();


        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        question: question
                    })

                });


            let data;

            try {

                data = await response.json();

            } catch (jsonError) {

                throw new Error(
                    "The AI server returned an invalid response."
                );

            }


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "The AI server could not process the request."
                );

            }


            if (!data.agent) {

                throw new Error(
                    "No specialist agent was returned by the AI."
                );

            }


            showWorkflow(data.agent);

            displayResult(data);


        } catch (error) {

            console.error(
                "NutriServe AI Error:",
                error
            );

            showError(
                error.message ||
                "Unable to connect to NutriServe AI."
            );

        } finally {

            analyzeButton.disabled = false;

            analyzeButton.classList.remove("loading");

            analyzeButton.innerHTML = `
                🤖 Analyze with AI Agents →
            `;

        }

    }


    /*
    ============================================================
    ANALYZE BUTTON
    ============================================================
    */

    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            analyzeQuestion
        );

    }


    /*
    ============================================================
    ENTER KEY SUPPORT
    ============================================================
    */

    if (questionInput) {

        questionInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" &&
                    (event.ctrlKey || event.metaKey)
                ) {

                    event.preventDefault();

                    analyzeQuestion();

                }

            }
        );

    }


    /*
    ============================================================
    EXAMPLE QUESTIONS
    ============================================================
    */

    exampleQuestions.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question ||
                        button.textContent.trim();

                    if (questionInput) {

                        questionInput.value =
                            question;

                        questionInput.focus();

                        questionInput.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                }
            );

        }
    );


    /*
    ============================================================
    QUICK QUESTIONS
    ============================================================
    */

    quickQuestions.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question ||
                        button.textContent.trim();

                    if (questionInput) {

                        questionInput.value =
                            question;

                        questionInput.focus();

                        questionInput.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                }
            );

        }
    );


    /*
    ============================================================
    SMOOTH NAVIGATION
    ============================================================
    */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const targetId =
                            link.getAttribute("href");

                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }

                        const target =
                            document.querySelector(
                                targetId
                            );

                        if (target) {

                            event.preventDefault();

                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                    }
                );

            }
        );


    /*
    ============================================================
    NAVBAR SCROLL EFFECT
    ============================================================
    */

    const navbar =
        document.querySelector(".navbar");

    if (navbar) {

        window.addEventListener(
            "scroll",
            () => {

                if (window.scrollY > 30) {

                    navbar.classList.add(
                        "scrolled"
                    );

                } else {

                    navbar.classList.remove(
                        "scrolled"
                    );

                }

            },
            { passive: true }
        );

    }


    /*
    ============================================================
    INITIAL STATE
    ============================================================
    */

    if (agentWorkflow) {

        agentWorkflow.style.display = "none";

    }

    if (agentResult) {

        agentResult.style.display = "none";

    }

});