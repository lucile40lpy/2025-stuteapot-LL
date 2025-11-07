// Form validation functions for Student Teapot Test

// Function to style text input boxes to be longer
function styleTextInputs() {
  // Style text inputs
  const textInputs = document.querySelectorAll(
    'input[type="text"], input[type="number"]'
  );
  textInputs.forEach((input) => {
    input.style.width = "400px";
    input.style.maxWidth = "90%";
    input.style.padding = "10px";
    input.style.fontSize = "16px";
    input.style.border = "2px solid #ccc";
    input.style.borderRadius = "4px";
    input.style.margin = "5px 0";
  });

  // Style textareas to be larger
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.width = "600px";
    textarea.style.maxWidth = "95%";
    textarea.style.minHeight = "120px";
    textarea.style.padding = "12px";
    textarea.style.fontSize = "16px";
    textarea.style.border = "2px solid #ccc";
    textarea.style.borderRadius = "4px";
    textarea.style.margin = "5px 0";
    textarea.style.resize = "vertical";
    textarea.style.fontFamily = "inherit";
  });

  // Style select elements for consistency
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    select.style.width = "400px";
    select.style.maxWidth = "90%";
    select.style.padding = "10px";
    select.style.fontSize = "16px";
    select.style.border = "2px solid #ccc";
    select.style.borderRadius = "4px";
    select.style.margin = "5px 0";
    select.style.backgroundColor = "white";
  });
}

// ============================================================================
// DYNAMIC VALIDATION SYSTEM
// ============================================================================

// Generic validation functions
function validateRequiredRadio(groupName, errorElementId) {
  const selected = document.querySelector(`input[name="${groupName}"]:checked`);
  const errorElement = document.getElementById(errorElementId);

  if (selected) {
    if (errorElement) errorElement.style.display = "none";
    return true;
  } else {
    if (errorElement) errorElement.style.display = "block";
    return false;
  }
}

function validateRequiredSelect(selectName, errorElementId) {
  const select = document.querySelector(`select[name="${selectName}"]`);
  const errorElement = document.getElementById(errorElementId);

  if (select && select.value) {
    if (errorElement) errorElement.style.display = "none";
    return true;
  } else {
    if (errorElement) errorElement.style.display = "block";
    return false;
  }
}

function validateTextLength(
  inputName,
  errorElementId,
  minLength = 0,
  maxLength = Infinity
) {
  const input = document.querySelector(`input[name="${inputName}"]`);
  const errorElement = document.getElementById(errorElementId);

  if (!input) return true;

  const value = input.value.trim();
  const isValid =
    value === "" || (value.length >= minLength && value.length <= maxLength);

  if (errorElement) {
    errorElement.style.display = isValid ? "none" : "block";
  }
  return isValid;
}

function validateNumberRange(inputName, errorElementId, min, max) {
  const input = document.querySelector(`input[name="${inputName}"]`);
  const errorElement = document.getElementById(errorElementId);

  if (!input) return true;

  const value = parseFloat(input.value);
  const isValid = !isNaN(value) && value >= min && value <= max;

  if (errorElement) {
    errorElement.style.display = isValid ? "none" : "block";
  }
  return isValid;
}

// Dynamic validation handler
function setupDynamicValidation() {
  // Remove all existing onchange attributes to prevent errors
  document.querySelectorAll("[onchange]").forEach((element) => {
    element.removeAttribute("onchange");
  });

  document.querySelectorAll("[oninput]").forEach((element) => {
    if (
      !element.name.includes("study-tips") &&
      !element.name.includes("remarks-admin")
    ) {
      element.removeAttribute("oninput");
    }
  });

  // Add event listeners for radio buttons and selects
  document
    .querySelectorAll('input[type="radio"], select')
    .forEach((element) => {
      element.addEventListener("change", function () {
        // Auto-save the answer
        saveAnswerToStorage(this.name, this.value);

        // Dynamic validation based on field type and name
        if (this.type === "radio") {
          validateRequiredRadio(this.name, `${this.name}-error`);
        } else if (this.tagName === "SELECT") {
          validateRequiredSelect(this.name, `${this.name}-error`);
        }
      });
    });

  // Add event listeners for text and number inputs
  document
    .querySelectorAll('input[type="text"], input[type="number"]')
    .forEach((element) => {
      element.addEventListener("input", function () {
        saveAnswerToStorage(this.name, this.value);

        // Specific validation based on field name
        if (this.name === "anonymous-id") {
          validateTextLength(this.name, `${this.name}-error`, 3, 20);
        } else if (this.name === "age") {
          validateNumberRange(this.name, `${this.name}-error`, 1, 120);
        } else if (this.name === "grades") {
          validateNumberRange(this.name, `${this.name}-error`, 0, 20);
        }
      });
    });
}

// ============================================================================
// CHARACTER COUNT FUNCTIONS
// ============================================================================

function initializeCharacterCount() {
  const remarksAdminTextarea = document.querySelector(
    'textarea[name="remarks-admin"]'
  );
  const studyTipsTextarea = document.querySelector(
    'textarea[name="study-tips"]'
  );

  if (remarksAdminTextarea) {
    remarksAdminTextarea.addEventListener("input", handleRemarksAdminInput);
    updateRemarksAdminCount();
  }

  if (studyTipsTextarea) {
    studyTipsTextarea.addEventListener("input", handleStudyTipsInput);
    updateStudyTipsCount();
  }
}

let remarksAdminTimeout;
function handleRemarksAdminInput(e) {
  clearTimeout(remarksAdminTimeout);
  remarksAdminTimeout = setTimeout(() => {
    updateRemarksAdminCount();
    saveAnswerToStorage("remarks-admin", e.target.value);
  }, 100);
}

let studyTipsTimeout;
function handleStudyTipsInput(e) {
  clearTimeout(studyTipsTimeout);
  studyTipsTimeout = setTimeout(() => {
    updateStudyTipsCount();
    saveAnswerToStorage("study-tips", e.target.value);
  }, 100);
}

function updateRemarksAdminCount() {
  const textarea = document.querySelector('textarea[name="remarks-admin"]');
  const charCount = document.getElementById("remarks-admin-char-count");

  if (!textarea || !charCount) return;

  const currentLength = textarea.value.length;
  charCount.textContent = `${currentLength}/600 characters`;

  if (currentLength > 600) {
    charCount.style.color = "#ff6b6b";
  } else if (currentLength > 480) {
    charCount.style.color = "#ffa500";
  } else {
    charCount.style.color = "#5c564f";
  }
}

function updateStudyTipsCount() {
  const textarea = document.querySelector('textarea[name="study-tips"]');
  const charCount = document.getElementById("study-tips-char-count");

  if (!textarea || !charCount) return;

  const currentLength = textarea.value.length;
  charCount.textContent = `${currentLength}/600 characters`;

  if (currentLength > 600) {
    charCount.style.color = "#ff6b6b";
  } else if (currentLength > 480) {
    charCount.style.color = "#ffa500";
  } else {
    charCount.style.color = "#5c564f";
  }
}

// Separate validation functions (only for form submission)
function validateRemarksAdmin() {
  const textarea = document.querySelector('textarea[name="remarks-admin"]');
  const errorElement = document.getElementById("remarks-admin-error");

  if (!textarea || !errorElement) return true;

  const currentLength = textarea.value.length;
  const isValid = currentLength <= 600;

  errorElement.style.display = isValid ? "none" : "block";
  return isValid;
}

function validateStudyTips() {
  const textarea = document.querySelector('textarea[name="study-tips"]');
  const errorElement = document.getElementById("study-tips-error");

  if (!textarea || !errorElement) return true;

  const currentLength = textarea.value.length;
  const isValid = currentLength <= 600;

  errorElement.style.display = isValid ? "none" : "block";
  return isValid;
}

// ============================================================================
// LOCAL STORAGE FUNCTIONS
// ============================================================================

function saveAnswerToStorage(name, value) {
  if (value !== null && value !== undefined && value !== "") {
    localStorage.setItem(name, value);
  }
}

function loadSavedAnswers() {
  // Load text inputs
  const textInputs = document.querySelectorAll(
    'input[type="text"], input[type="number"]'
  );
  textInputs.forEach((input) => {
    const savedValue = localStorage.getItem(input.name);
    if (savedValue) {
      input.value = savedValue;
    }
  });

  // Load textareas
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    const savedValue = localStorage.getItem(textarea.name);
    if (savedValue) {
      textarea.value = savedValue;
      if (textarea.name === "remarks-admin") {
        updateRemarksAdminCount();
      } else if (textarea.name === "study-tips") {
        updateStudyTipsCount();
      }
    }
  });

  // Load select elements
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    const savedValue = localStorage.getItem(select.name);
    if (savedValue) {
      select.value = savedValue;
    }
  });

  // Load radio buttons
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    const savedValue = localStorage.getItem(radio.name);
    if (savedValue && radio.value === savedValue) {
      radio.checked = true;
    }
  });
}

// Save all form data to localStorage
function saveAllFormData() {
  const formData = collectFormData();

  Object.keys(formData).forEach((key) => {
    if (formData[key] !== null && formData[key] !== undefined) {
      localStorage.setItem(key, formData[key]);
    }
  });

  localStorage.setItem("questionnaire_timestamp", new Date().toISOString());
}

// ============================================================================
// FORM SUBMISSION AND VALIDATION
// ============================================================================

// Group validation functions for final submission
function validateFFMQuestions() {
  let allValid = true;
  for (let i = 1; i <= 10; i++) {
    if (!validateRequiredRadio(`ffm${i}`, `ffm${i}-error`)) {
      allValid = false;
    }
  }
  return allValid;
}

function validateILSActQuestions() {
  let allValid = true;
  for (let i = 1; i <= 10; i++) {
    if (!validateRequiredRadio(`ils-act${i}`, `ils-act${i}-error`)) {
      allValid = false;
    }
  }
  return allValid;
}

function validateILSMotQuestions() {
  let allValid = true;
  for (let i = 1; i <= 10; i++) {
    if (!validateRequiredRadio(`ils-mot${i}`, `ils-mot${i}-error`)) {
      allValid = false;
    }
  }
  return allValid;
}

const pedagogyMethods = [
  "lecture",
  "interactive-lecture",
  "directed-discussion",
  "classroom-assessment",
  "group-work",
  "student-peer-feedback",
  "cookbook-labs",
  "just-in-time",
  "case-method",
  "inquiry-based",
  "problem-based",
  "project-based",
  "role-plays",
  "fieldwork",
];

function validatePedagogyQuestions() {
  let allValid = true;
  pedagogyMethods.forEach((method) => {
    if (
      !validateRequiredRadio(
        `pedagogy-${method}-like`,
        `pedagogy-${method}-like-error`
      )
    ) {
      allValid = false;
    }
    if (
      !validateRequiredRadio(
        `pedagogy-${method}-learn`,
        `pedagogy-${method}-learn-error`
      )
    ) {
      allValid = false;
    }
  });
  return allValid;
}

const teachingStyles = [
  "expert",
  "formal-authority",
  "personal-model",
  "facilitator",
  "delegator",
];

function validateTeachingStyleQuestions() {
  let allValid = true;
  teachingStyles.forEach((style) => {
    if (
      !validateRequiredRadio(
        `teaching-style-${style}-like`,
        `teaching-style-${style}-like-error`
      )
    ) {
      allValid = false;
    }
    if (
      !validateRequiredRadio(
        `teaching-style-${style}-learn`,
        `teaching-style-${style}-learn-error`
      )
    ) {
      allValid = false;
    }
  });
  return allValid;
}

// Comprehensive validation function
function validateAll(event) {
  if (event) {
    event.preventDefault();
  }

  const validations = [
    validateTextLength("anonymous-id", "anonymous-id-error", 3, 20),
    validateRequiredRadio("gender", "gender-error"),
    validateNumberRange("age", "age-error", 1, 120),
    validateRequiredSelect("economic-situation", "eco-error"),
    validateRequiredRadio("class-year", "class-year-error"),
    validateRequiredRadio("study-field", "study-field-error"),
    validateNumberRange("grades", "grades-error", 0, 20),
    validateRequiredRadio("self-confidence", "self-confidence-error"),
    validateRequiredRadio("stress", "stress-error"),
    validateRequiredRadio("well-being", "well-being-error"),
    validateRequiredRadio("knowledge-durability", "knowledge-durability-error"),
    validateRequiredRadio("cheating", "cheating-error"),
    validateFFMQuestions(),
    validateILSActQuestions(),
    validateILSMotQuestions(),
    validatePedagogyQuestions(),
    validateTeachingStyleQuestions(),
    validateRemarksAdmin(),
    validateStudyTips(),
  ];

  const hasErrors = validations.includes(false);

  if (!hasErrors) {
    saveAllFormData();
    // Allow the form to submit normally to Flask
    document.getElementById("test-form").submit();
    return true;
  } else {
    alert("Please complete all required fields correctly before submitting.");
    const firstError = document.querySelector(
      '[id$="-error"][style*="display: block"]'
    );
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return false;
  }
}

// Form data collection function
function collectFormData() {
  const formData = {
    anonymousID: document.querySelector('input[name="anonymous-id"]')?.value,
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    age: document.querySelector('input[name="age"]')?.value,
    economicSituation: document.querySelector(
      'select[name="economic-situation"]'
    )?.value,
    classYear: document.querySelector('input[name="class-year"]:checked')
      ?.value,
    studyField: document.querySelector('input[name="study-field"]:checked')
      ?.value,
    grades: document.querySelector('input[name="grades"]')?.value,
    selfConfidence: document.querySelector(
      'input[name="self-confidence"]:checked'
    )?.value,
    stress: document.querySelector('input[name="stress"]:checked')?.value,
    wellBeing: document.querySelector('input[name="well-being"]:checked')
      ?.value,
    knowledgeDurability: document.querySelector(
      'input[name="knowledge-durability"]:checked'
    )?.value,
    cheating: document.querySelector('input[name="cheating"]:checked')?.value,
    remarksAdmin: document.querySelector('textarea[name="remarks-admin"]')
      ?.value,
    studyTips: document.querySelector('textarea[name="study-tips"]')?.value,
  };

  // Add radio group data
  for (let i = 1; i <= 10; i++) {
    formData[`ffm${i}`] = document.querySelector(
      `input[name="ffm${i}"]:checked`
    )?.value;
    formData[`ils-act${i}`] = document.querySelector(
      `input[name="ils-act${i}"]:checked`
    )?.value;
    formData[`ils-mot${i}`] = document.querySelector(
      `input[name="ils-mot${i}"]:checked`
    )?.value;
  }

  // Add pedagogy and teaching style data
  pedagogyMethods.forEach((method) => {
    formData[`pedagogy-${method}-like`] = document.querySelector(
      `input[name="pedagogy-${method}-like"]:checked`
    )?.value;
    formData[`pedagogy-${method}-learn`] = document.querySelector(
      `input[name="pedagogy-${method}-learn"]:checked`
    )?.value;
  });

  teachingStyles.forEach((style) => {
    formData[`teaching-style-${style}-like`] = document.querySelector(
      `input[name="teaching-style-${style}-like"]:checked`
    )?.value;
    formData[`teaching-style-${style}-learn`] = document.querySelector(
      `input[name="teaching-style-${style}-learn"]:checked`
    )?.value;
  });

  return formData;
}

// Form submission handler
function setupFormSubmission() {
  const form = document.getElementById("test-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      if (!validateAll(event)) {
        event.preventDefault();
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  styleTextInputs();
  initializeCharacterCount();
  loadSavedAnswers();
  setupDynamicValidation();
  setupFormSubmission();
});
