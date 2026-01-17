const fileInput = document.getElementById("pdfUpload");
const resumeDisplay = document.getElementById("resumeDisplay");
const questionList = document.getElementById("questionList");
const resumeCountSpan = document.getElementById("resumeCount");
const resetBtn = document.getElementById("resetCount");
const themeColor = document.getElementById("themeColor");
const leftPanel = document.querySelector(".left-panel");
const rightPanel = document.querySelector(".right-panel");
let resumeCount = parseInt(localStorage.getItem("resumeCount")) || 0;
resumeCountSpan.textContent = resumeCount;
fileInput.addEventListener("change", handlePDFUpload);

async function handlePDFUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Increase resume count
    resumeCount++;
    localStorage.setItem("resumeCount", resumeCount);
    resumeCountSpan.textContent = resumeCount;

    const reader = new FileReader();
    reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            extractedText += content.items.map(item => item.str).join(" ") + "\n";
        }

        // Display resume
        resumeDisplay.textContent = extractedText;

        // Generate interview questions
        generateInterviewQuestions(extractedText.toLowerCase());
    };

    reader.readAsArrayBuffer(file);
}
function generateInterviewQuestions(text) {
    questionList.innerHTML = "";

    const questions = [
        "Can you walk me through your resume?",
        "What are your key strengths?"
    ];

    if (text.includes("java")) {
        questions.push("Explain a Java project you worked on.");
    }
    if (text.includes("python")) {
        questions.push("How have you used Python?");
    }
    if (text.includes("sql") || text.includes("database")) {
        questions.push("Describe a database you worked with.");
    }
    if (text.includes("javascript") || text.includes("react")) {
        questions.push("How did you design the front end?");
    }
    if (text.includes("intern")) {
        questions.push("What were your responsibilities during your internship?");
    }
    if (text.includes("team") || text.includes("lead")) {
        questions.push("Describe your role in a team.");
    }

    questions.forEach(q => {
        const li = document.createElement("li");
        li.textContent = q;
        questionList.appendChild(li);
    });
}
resetBtn.addEventListener("click", () => {
    resumeCount = 0;
    localStorage.setItem("resumeCount", 0);
    resumeCountSpan.textContent = 0;
});
themeColor.addEventListener("input", () => {
    const color = themeColor.value;

    document.documentElement.style.setProperty("--primary-bg", color);

    const brightness = getBrightness(color);
    if (brightness < 140) {
        document.documentElement.style.setProperty("--panel-text", "#ffffff");
        document.documentElement.style.setProperty("--text-color", "#ffffff");
        document.documentElement.style.setProperty("--secondary-bg", "#0f172a");
    } else {
        document.documentElement.style.setProperty("--panel-text", "#000000");
        document.documentElement.style.setProperty("--text-color", "#000000");
        document.documentElement.style.setProperty("--secondary-bg", "#eaf4ff");
    }
});

function getBrightness(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}
