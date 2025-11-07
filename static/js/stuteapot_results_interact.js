// Learning style calculation and display
document.addEventListener("DOMContentLoaded", function () {
  calculateAndDisplayResults();
});

function calculateAndDisplayResults() {
  // Retrieve ILS answers from localStorage
  const ilsAnswers = getILSAnswersFromStorage();

  if (!ilsAnswers || Object.keys(ilsAnswers).length === 0) {
    displayError(
      "No ILS answers found. Please complete the questionnaire first."
    );
    return;
  }

  // Calculate learning style scores
  const scores = calculateLearningStyleScores(ilsAnswers);

  // Display results
  displayMainLearningStyle(scores);
  displayDetailedScores(scores);
}

function getILSAnswersFromStorage() {
  const answers = {};

  // Retrieve ILS activity answers (act1 to act10)
  for (let i = 1; i <= 10; i++) {
    const actKey = `ils-act${i}`;
    const storedValue = localStorage.getItem(actKey);
    if (storedValue) {
      answers[actKey] = parseInt(storedValue);
    }
  }

  // Retrieve ILS motive answers (mot1 to mot10)
  for (let i = 1; i <= 10; i++) {
    const motKey = `ils-mot${i}`;
    const storedValue = localStorage.getItem(motKey);
    if (storedValue) {
      answers[motKey] = parseInt(storedValue);
    }
  }

  return answers;
}

function calculateLearningStyleScores(answers) {
  // Convert Likert scale values (1-5) to percentages (0-100%)
  const normalizeScore = (value) => ((value - 1) / 4) * 100;

  // Meaning-oriented: act1, act2, act6, act7, mot1, mot6
  const meaningVars = [
    "ils-act1",
    "ils-act2",
    "ils-act6",
    "ils-act7",
    "ils-mot1",
    "ils-mot6",
  ];
  const meaningScores = meaningVars
    .map((varName) => answers[varName])
    .filter((score) => !isNaN(score));
  const meaningScore =
    meaningScores.length > 0
      ? meaningScores.reduce((sum, score) => sum + normalizeScore(score), 0) /
        meaningScores.length
      : 0;

  // Reproduction-oriented: act3, act4, act8, act9, mot2, mot7
  const reproductionVars = [
    "ils-act3",
    "ils-act4",
    "ils-act8",
    "ils-act9",
    "ils-mot2",
    "ils-mot7",
  ];
  const reproductionScores = reproductionVars
    .map((varName) => answers[varName])
    .filter((score) => !isNaN(score));
  const reproductionScore =
    reproductionScores.length > 0
      ? reproductionScores.reduce(
          (sum, score) => sum + normalizeScore(score),
          0
        ) / reproductionScores.length
      : 0;

  // Application-oriented: act5, mot3, mot7, mot9
  const applicationVars = ["ils-act5", "ils-mot3", "ils-mot7", "ils-mot9"];
  const applicationScores = applicationVars
    .map((varName) => answers[varName])
    .filter((score) => !isNaN(score));
  const applicationScore =
    applicationScores.length > 0
      ? applicationScores.reduce(
          (sum, score) => sum + normalizeScore(score),
          0
        ) / applicationScores.length
      : 0;

  // Undirected: act10, mot4, mot5, mot10, mot8
  const undirectedVars = [
    "ils-act10",
    "ils-mot4",
    "ils-mot5",
    "ils-mot10",
    "ils-mot8",
  ];
  const undirectedScores = undirectedVars
    .map((varName) => answers[varName])
    .filter((score) => !isNaN(score));
  const undirectedScore =
    undirectedScores.length > 0
      ? undirectedScores.reduce(
          (sum, score) => sum + normalizeScore(score),
          0
        ) / undirectedScores.length
      : 0;

  return {
    meaning: Math.round(meaningScore),
    reproduction: Math.round(reproductionScore),
    application: Math.round(applicationScore),
    undirected: Math.round(undirectedScore),
  };
}

function displayMainLearningStyle(scores) {
  const mainStyleElement = document.getElementById("main-style-text");

  // Find the learning style with the highest score
  const styles = [
    { name: "meaning-oriented", score: scores.meaning },
    { name: "reproduction-oriented", score: scores.reproduction },
    { name: "application-oriented", score: scores.application },
    { name: "undirected", score: scores.undirected },
  ];

  const mainStyle = styles.reduce((max, style) =>
    style.score > max.score ? style : max
  );

  mainStyleElement.textContent = `Your main learning style is ${mainStyle.name}.`;
}

function displayDetailedScores(scores) {
  // Update score text and bars for each learning style
  updateScoreDisplay("meaning", scores.meaning);
  updateScoreDisplay("reproduction", scores.reproduction);
  updateScoreDisplay("application", scores.application);
  updateScoreDisplay("undirected", scores.undirected);
}

function updateScoreDisplay(style, score) {
  const scoreTextElement = document.getElementById(`${style}-score-text`);
  const scoreBarElement = document.getElementById(`${style}-score-bar`);

  if (scoreTextElement) {
    scoreTextElement.textContent = `${score}%`;
  }

  if (scoreBarElement) {
    scoreBarElement.style.width = `${score}%`;
  }
}

function displayError(message) {
  const mainStyleElement = document.getElementById("main-style-text");
  mainStyleElement.textContent = message;
  mainStyleElement.style.color = "red";
}

function goBackToTest() {
  // Redirect back to the questionnaire page
  window.location.href = "stuteapot_test_en.html";
}

function saveResults() {
  // Retrieve current scores
  const scores = calculateLearningStyleScores(getILSAnswersFromStorage());

  // Save to localStorage for future reference
  localStorage.setItem("learningStyleResults", JSON.stringify(scores));

  alert("Results saved successfully!");
}

// Utility function to clear stored results (for testing)
function clearStoredResults() {
  // Clear ILS answers
  for (let i = 1; i <= 10; i++) {
    localStorage.removeItem(`ils-act${i}`);
    localStorage.removeItem(`ils-mot${i}`);
  }

  // Clear calculated results
  localStorage.removeItem("learningStyleResults");

  console.log("Stored results cleared");
}
