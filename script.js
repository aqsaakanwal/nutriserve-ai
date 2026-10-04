const API_URL = "http://127.0.0.1:3000/api/analyze";

const questionInput = document.getElementById("questionInput");
const analyzeButton = document.getElementById("analyzeButton");
const agentResult = document.getElementById("agentResult");

console.log("NutriServe AI frontend loaded successfully.");
console.log("Backend API:", API_URL);


const agentThemes = {

    "Nutrition Agent": {
        icon: "🥗",
        label: "NUTRITION INTELLIGENCE",
        color: "#16a34a",
        background: "#f0fdf4",
        border: "#bbf7d0"
    },

    "Food Safety Agent": {
        icon: "🛡️",
        label: "FOOD SAFETY INTELLIGENCE",
        color: "#2563eb",
        background: "#eff6ff",
        border: "#bfdbfe"
    },

    "Food Science Agent": {
        icon: "🔬",
        label: "FOOD SCIENCE INTELLIGENCE",
        color: "#7c3aed",
        background: "#f5f3ff",
        border: "#ddd6fe"
    },

    "Hospitality Agent": {
        icon: "🏨",
        label: "HOSPITALITY INTELLIGENCE",
        color: "#c2410c",
        background: "#fff7ed",
        border: "#fed7aa"
    }

};


async function analyzeQuestion(question) {

    if (!question || question.trim() === "") {

        alert("Please enter a question first.");

        return;
    }

    const cleanQuestion = question.trim();

    console.log("Question submitted:", cleanQuestion);

    if (analyzeButton) {

        analyzeButton.disabled = true;

        analyzeButton.innerHTML =
            "🤖 AI Agents Analyzing...";
    }

    if (agentResult) {

        agentResult.style.display = "block";

        agentResult.innerHTML = `
            <div class="result-loading">
                <div class="loading-spinner"></div>

                <h3>
                    NutriServe AI is analyzing your question...
                </h3>

                <p>
                    Orchestrator Agent is selecting the most relevant specialist.
                </p>
            </div>
        `;
    }

    try {

        console.log("Sending request to backend...");

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: cleanQuestion
            })

        });

        console.log(
            "Backend response status:",
            response.status
        );

        const data = await response.json();

        console.log(
            "Backend response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Backend request failed."
            );
        }

        displayResult(data);

    } catch (error) {

        console.error(
            "NutriServe AI Error:",
            error
        );

        if (agentResult) {

            agentResult.style.display = "block";

            agentResult.innerHTML = `
                <div class="result-error">

                    <h3>
                        ⚠️ Something went wrong
                    </h3>

                    <p>
                        ${escapeHtml(error.message)}
                    </p>

                    <p>
                        Please make sure the NutriServe AI backend is running on port 3000.
                    </p>

                </div>
            `;
        }

    } finally {

        if (analyzeButton) {

            analyzeButton.disabled = false;

            analyzeButton.innerHTML =
                "🤖 Analyze with AI Agents →";
        }
    }
}


function displayResult(data) {

    if (!agentResult) {

        console.error(
            "agentResult element was not found."
        );

        return;
    }

    const domain =
        data.domain || "AI Specialist";

    const agent =
        data.agent || "Specialist Agent";

    const reason =
        data.reason ||
        "The AI Orchestrator selected this specialist based on your question.";

    const analysis =
        data.analysis ||
        "No analysis was returned.";

    const recommendation =
        data.recommendation ||
        "No recommendation was returned.";

    const safetyNote =
        data.safety_note ||
        "";

    const theme =
        agentThemes[agent] ||
        {
            icon: "🤖",
            label: "NUTRISERVE AI",
            color: "#16845b",
            background: "#f0fdf4",
            border: "#bbf7d0"
        };


    agentResult.style.display = "block";


    agentResult.innerHTML = `

        <div
            class="result-header"
            style="
                background:${theme.background};
                border-bottom-color:${theme.border};
            "
        >

            <div
                class="result-agent-icon"
                style="
                    border-color:${theme.border};
                "
            >
                ${theme.icon}
            </div>

            <div>

                <div
                    class="result-label"
                    style="color:${theme.color};"
                >
                    ${theme.label}
                </div>

                <h3>
                    ${escapeHtml(agent)}
                </h3>

            </div>

        </div>


        <div
            class="result-domain"
            style="
                color:${theme.color};
                background:${theme.background};
                border-color:${theme.border};
            "
        >

            <strong>Domain:</strong>

            ${escapeHtml(domain)}

        </div>


        <div class="result-section">

            <h4>
                🧠 AI Analysis
            </h4>

            <p>
                ${formatText(analysis)}
            </p>

        </div>


        <div class="result-section">

            <h4>
                💡 Recommendation
            </h4>

            <p>
                ${formatText(recommendation)}
            </p>

        </div>


        ${
            safetyNote
                ? `
                    <div class="result-section safety-section">

                        <h4>
                            🛡️ Safety Note
                        </h4>

                        <p>
                            ${formatText(safetyNote)}
                        </p>

                    </div>
                `
                : ""
        }


        <div
            class="result-routing"
            style="
                border-left-color:${theme.color};
                background:${theme.background};
            "
        >

            <strong
                style="color:${theme.color};"
            >
                Orchestrator Decision
            </strong>

            <p>
                ${escapeHtml(reason)}
            </p>

        </div>

    `;


    agentResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function formatText(text) {

    return escapeHtml(String(text))
        .replace(/\n/g, "<br>");
}


function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function setQuestion(question) {

    if (!questionInput) {

        console.error(
            "questionInput element was not found."
        );

        return;
    }

    questionInput.value = question;

    questionInput.focus();

    questionInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "NutriServe AI DOM ready."
        );


        const quickQuestions =
            document.querySelectorAll(
                ".quick-question, .example-question"
            );


        quickQuestions.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const question =
                            button.dataset.question ||
                            button.textContent.trim();

                        setQuestion(question);
                    }
                );

            }
        );


        if (analyzeButton) {

            analyzeButton.addEventListener(
                "click",
                function () {

                    analyzeQuestion(
                        questionInput.value
                    );

                }
            );

        } else {

            console.error(
                "Analyze button not found."
            );
        }


        if (questionInput) {

            questionInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" &&
                        (event.ctrlKey || event.metaKey)
                    ) {

                        event.preventDefault();

                        analyzeQuestion(
                            questionInput.value
                        );

                    }

                }
            );

        }

    }
);