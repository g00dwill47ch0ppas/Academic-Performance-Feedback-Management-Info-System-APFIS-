console.log("Student Performance Assistant Loaded.");
// ==========================================
// GLOBAL HEADER TOOLS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("HEADER TOOLS SCRIPT REACHED");


    // --------------------------------------
    // Header Elements
    // --------------------------------------

    const darkModeToggle =
        document.getElementById("darkModeToggle");

    const darkModeIcon =
        document.getElementById("darkModeIcon");

    const settingsToggle =
        document.getElementById("settingsToggle");

    const settingsSidebar =
        document.getElementById("settingsSidebar");

    const settingsOverlay =
        document.getElementById("settingsOverlay");

    const settingsClose =
        document.getElementById("settingsClose");


    console.log(
        "Dark mode button:",
        darkModeToggle
    );

    console.log(
        "Dark mode icon:",
        darkModeIcon
    );

    console.log(
        "Settings button:",
        settingsToggle
    );


    // --------------------------------------
    // Dark Mode
    // --------------------------------------

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        if (darkModeIcon) {

            darkModeIcon.classList.remove(
                "fa-moon"
            );

            darkModeIcon.classList.add(
                "fa-sun"
            );

        }

    }


    if (darkModeToggle) {

        darkModeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const darkModeEnabled =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                localStorage.setItem(
                    "theme",
                    darkModeEnabled
                        ? "dark"
                        : "light"
                );


                if (darkModeIcon) {

                    darkModeIcon.classList.toggle(
                        "fa-moon",
                        !darkModeEnabled
                    );

                    darkModeIcon.classList.toggle(
                        "fa-sun",
                        darkModeEnabled
                    );

                }

            }
        );

    }


    // --------------------------------------
    // Settings Sidebar
    // --------------------------------------

    function openSettings() {

        if (!settingsSidebar) {

            return;

        }


        settingsSidebar.classList.add(
            "active"
        );


        if (settingsOverlay) {

            settingsOverlay.classList.add(
                "active"
            );

        }

    }


    function closeSettings() {

        if (!settingsSidebar) {

            return;

        }


        settingsSidebar.classList.remove(
            "active"
        );


        if (settingsOverlay) {

            settingsOverlay.classList.remove(
                "active"
            );

        }

    }


    if (settingsToggle) {

        settingsToggle.addEventListener(
            "click",
            openSettings
        );

    }


    if (settingsClose) {

        settingsClose.addEventListener(
            "click",
            closeSettings
        );

    }


    if (settingsOverlay) {

        settingsOverlay.addEventListener(
            "click",
            closeSettings
        );

    }


    // --------------------------------------
    // Close Settings With Escape
    // --------------------------------------

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeSettings();

            }

        }
    );


    // --------------------------------------
// Close Application
// --------------------------------------

const closeAppButton =
    document.getElementById("closeAppButton");

if (closeAppButton) {

    closeAppButton.addEventListener(
        "click",
        async () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to close the Student Performance Assistant?"
                );

            if (!confirmed) {
                return;
            }

            try {

                await fetch(
                    "/shutdown",
                    {
                        method: "POST"
                    }
                );

            }
            catch (error) {

                console.error(
                    "Unable to close application:",
                    error
                );

            }

        }
    );

}

    console.log(
        "Header tools initialized successfully."
    );

});
// ==========================================
// Journey Introduction Model
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const category = document.getElementById("assessmentCategory");
    const quantityContainer = document.getElementById("quantityContainer");

    if (!category) return;

    category.addEventListener("change", function () {

        const multipleCategories = [
            "Class Test",
            "Assignment",
            "Practical Assignment",
            "Attendance"
        ];

        if (multipleCategories.includes(this.value)) {

            quantityContainer.style.display = "block";

        } else {

            quantityContainer.style.display = "none";

        }

    });

});

// ==========================================
// Assessment Builder
// ==========================================

const addButton = document.getElementById("addAssessment");
const tableBody = document.getElementById("assessmentTableBody");

const assessmentCategory = document.getElementById("assessmentCategory");
const assessmentQuantity = document.getElementById("assessmentQuantity");
const assessmentWeight = document.getElementById("assessmentWeight");

let assessments = [];

if (addButton) {

    addButton.addEventListener("click", () => {

        const category = assessmentCategory.value;
        const quantity = assessmentQuantity.value || 1;
        const weight = assessmentWeight.value;

        if (!category) {

            alert("Please select an assessment category.");

            return;

        }

        if (!weight) {

            alert("Please enter the weighting.");

            return;

        }

        if (assessments.some(item => item.category === category)) {

            alert("This assessment category has already been added.");

            return;

        }

        assessments.push({

            category,
            quantity,
            weight

        });

        // Remove selected category from the dropdown

        const selectedOption =
            assessmentCategory.querySelector(
                `option[value="${category}"]`
            );

        if (selectedOption) {

            selectedOption.remove();

        }

        renderAssessmentTable();

        assessmentCategory.selectedIndex = 0;
        assessmentQuantity.value = "";
        assessmentWeight.value = "";
        quantityContainer.style.display = "none";

    });

}

//const selectedOption =
//assessmentCategory.querySelector(
//    `option[value="${category}"]`
//);

//if (selectedOption) {
//
//    selectedOption.remove();

//}

function renderAssessmentTable() {

    tableBody.innerHTML = "";

    assessments.forEach((assessment, index) => {

        tableBody.innerHTML += `

        <tr>

            <td>${assessment.category}</td>

            <td>${assessment.quantity}</td>

            <td>${assessment.weight}%</td>

            <td>

                <button
                    class="btn btn-sm btn-danger delete-btn"
                    data-index="${index}">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

    attachButtonEvents();

}

function attachButtonEvents() {

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.onclick = function () {

            const index = this.dataset.index;

            const removedAssessment = assessments[index];

            const option = document.createElement("option");

            option.value = removedAssessment.category;

            option.textContent = removedAssessment.category;

            assessmentCategory.appendChild(option);

            assessments.splice(index, 1);

            if (assessments.length === 0) {

                tableBody.innerHTML = `

                <tr>

                    <td colspan="4" class="text-center text-muted">

                        No assessments have been added yet.

                    </td>

                </tr>

                `;

                return;

            }

            renderAssessmentTable();

        };

    });

}

// ==========================================
// Continue To Phase 2
// ==========================================

const continueButton =
    document.getElementById("continuePhase2");

if (continueButton) {

    continueButton.addEventListener("click", () => {

        validatePhaseOne();

    });

}

function validatePhaseOne() {

    const firstName =
        document.getElementById("firstName").value.trim();

    const surname =
        document.getElementById("surname").value.trim();

    const studentNumber =
        document.getElementById("studentNumber").value.trim();

    const module =
        document.getElementById("module").value.trim();

    if (
        !firstName ||
        !surname ||
        !studentNumber ||
        !module
    ) {

        alert(
            "Please complete all student information before continuing."
        );

        return;
    }

    if (assessments.length === 0) {

        alert(
            "Please add at least one assessment before continuing."
        );

        return;
    }

    const totalWeight =
        assessments.reduce(
            (sum, item) =>
                sum + Number(item.weight),
            0
        );

    if (totalWeight !== 100) {

        alert(
            `Total weighting is currently ${totalWeight}%.\n\nThe assessment plan must equal exactly 100%.`
        );

        return;
    }

    showConfirmationModal();

}

function showConfirmationModal() {

    const content =
        document.getElementById(
            "confirmationContent"
        );

    const firstName =
        document.getElementById("firstName").value;

    const surname =
        document.getElementById("surname").value;

    const studentNumber =
        document.getElementById("studentNumber").value;

    const module =
        document.getElementById("module").value;

    let tableRows = "";

    assessments.forEach(item => {

        tableRows += `

    <tr>

        <td>${item.category}</td>

        <td>${item.quantity}</td>

        <td>${item.weight}%</td>

    </tr>

    `;

    });

    // ==========================================
    // Save Model Before Entering Phase 2
    // ==========================================

    const confirmContinue =
        document.getElementById("confirmContinue");

    if (confirmContinue) {

        confirmContinue.addEventListener("click", () => {

            const studentModel = {

                firstName:
                    document.getElementById("firstName").value,

                surname:
                    document.getElementById("surname").value,

                studentNumber:
                    document.getElementById("studentNumber").value,

                module:
                    document.getElementById("module").value,

                assessments

            };

            localStorage.setItem(
                "studentModel",
                JSON.stringify(studentModel)
            );

            window.location.href = "/phase2";

        });

    }

    content.innerHTML = `

        <h5>Student Information</h5>

        <p>

        <strong>Name:</strong>
        ${firstName} ${surname}

        <br>

        <strong>Student Number:</strong>
        ${studentNumber}

        <br>

        <strong>Module:</strong>
        ${module}

        </p>

        <hr>

        <h5>Assessment Plan</h5>

        <table class="table">

            <thead>

                <tr>

                    <th>Assessment</th>

                    <th>Quantity</th>

                    <th>Weight</th>

                </tr>

            </thead>

            <tbody>

                ${tableRows}

            </tbody>

        </table>

        <p>

        Please verify that this assessment plan matches the assessment plan provided by your lecturer.

        </p>

    `;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "confirmModelModal"
            )
        );

    modal.show();

}

// ==========================================
// Phase 2 - Load Student Model
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const storedModel =
        localStorage.getItem("studentModel");

    if (!storedModel) {

        return;

    }

    const studentModel = JSON.parse(storedModel);

    // -----------------------------
    // Populate Student Information
    // -----------------------------

    const firstName =
        document.getElementById("phase2FirstName");

    const surname =
        document.getElementById("phase2Surname");

    const studentNumber =
        document.getElementById("phase2StudentNumber");

    const module =
        document.getElementById("phase2Module");

    if (firstName) {

        firstName.value = studentModel.firstName;
        surname.value = studentModel.surname;
        studentNumber.value = studentModel.studentNumber;
        module.value = studentModel.module;

    }

    // -----------------------------
    // Build Marks Table
    // -----------------------------

    const tableBody =
        document.getElementById("marksTableBody");

    if (!tableBody) {

        return;

    }

    tableBody.innerHTML = "";

    studentModel.assessments.forEach(item => {

        for (let i = 1; i <= item.quantity; i++) {

            tableBody.innerHTML += `

            <tr>

                <td>

                    ${item.category}
                    ${item.quantity > 1 ? i : ""}

                </td>

                <td>

                    ${i === 1 ? item.weight + "%" : ""}

                </td>

                <td>

                    <input
                        type="number"
                        class="form-control mark-input"
                        data-weight="${item.weight / item.quantity}"
                        data-mark="${item.marks && item.marks[i - 1] !== undefined
                    ? item.marks[i - 1]
                    : ""}"
                        min="0"
                        max="100"
                        placeholder="0 - 100">

                        

                </td>

            </tr>

            `;
            document.querySelectorAll(".mark-input").forEach(input => {

                const mark = input.dataset.mark;

                if (mark !== "") {
                    input.value = mark;
                }

            });

        }

    });

    // --------------------------------------
    // Load marks from returning student CSV
    // --------------------------------------

    const storedReturningMarks =
        localStorage.getItem(
            "returningAssessmentMarks"
        );


    if (storedReturningMarks) {

        const returningMarks =
            JSON.parse(
                storedReturningMarks
            );


        const markInputs =
            document.querySelectorAll(
                ".mark-input"
            );


        markInputs.forEach((input, index) => {

            const importedAssessment =
                returningMarks[index];


            if (!importedAssessment) {
                return;
            }


            if (
                importedAssessment.mark !== undefined &&
                importedAssessment.mark !== null &&
                importedAssessment.mark !== ""
            ) {

                input.value =
                    importedAssessment.mark;

            }

        });

    }

});

// ==========================================
// Phase 2 - Generate Academic Profile
// ==========================================

const generateButton =
    document.getElementById("generateModel");

if (generateButton) {

    generateButton.addEventListener("click", generateAcademicProfile);

}

function generateAcademicProfile() {

    const studentModel =
        JSON.parse(localStorage.getItem("studentModel"));

    const markInputs =
        document.querySelectorAll(".mark-input");

    let totalParticipation = 0;

    let completed = 0;

    let remaining = 0;

    let inputIndex = 0;

    let remainingWeight = 0;

    const remainingAssessmentCounts = {};

    const remainingAssessmentDetails = [];

    const factorPerformance = [];

    studentModel.assessments.forEach(item => {

        const weightPerAssessment =
            Number(item.weight) / item.quantity;

        let remainingForCategory = 0;

        let completedMarks = 0;

        let completedCount = 0;

        for (let i = 0; i < item.quantity; i++) {

            const value =
                markInputs[inputIndex].value;

            if (value !== "") {

                completed++;

                completedMarks +=
                    Number(value);

                completedCount++;

                totalParticipation +=
                    (Number(value) / 100) *
                    weightPerAssessment;

            }

            else {

                remaining++;

                remainingWeight += weightPerAssessment;

                remainingForCategory++;

            }

            inputIndex++;

        }

        const currentAverage =
            completedCount > 0
                ? completedMarks / completedCount
                : 0;

        factorPerformance.push({

            category:
                item.category,

            totalAssessments:
                Number(item.quantity),

            completedAssessments:
                completedCount,

            remainingAssessments:
                remainingForCategory,

            currentAverage:
                Number(
                    currentAverage.toFixed(2)
                ),

            weight:
                Number(item.weight),

            weightPerAssessment:
                weightPerAssessment

        });

        remainingAssessmentCounts[item.category] =
            remainingForCategory;

        remainingAssessmentDetails.push({

            category: item.category,

            quantity: item.quantity,

            remaining: remainingForCategory,

            weight: Number(item.weight),

            weightPerAssessment: weightPerAssessment

        });

    });
    let standing = "";

    if (totalParticipation >= 75) {

        standing = "Excellent";

    }

    else if (totalParticipation >= 60) {

        standing = "Good";

    }

    else if (totalParticipation >= 50) {

        standing = "Satisfactory";

    }

    else {

        standing = "At Risk";

    }

    // ==========================================
    // Algorithm 2
    // Build Remaining Assessment Sessions
    // ==========================================

    const remainingSessions = [];

    // Temporary session counter
    let sessionNumber = 1;

    factorPerformance.forEach(factor => {

        for (
            let i = 1;
            i <= factor.remainingAssessments;
            i++
        ) {

            remainingSessions.push({

                session: sessionNumber,

                assessments: [

                    {
                        category:
                            factor.category,

                        assessmentNumber:
                            i,

                        weightPerAssessment:
                            factor.weightPerAssessment
                    }

                ]

            });

            sessionNumber++;

        }

    });

    // ==========================================
    // Save Academic Profile
    // ==========================================

    const academicProfile = {

        participationMark: totalParticipation,

        academicStanding: standing,

        completedAssessments: completed,

        remainingAssessments: remaining,

        remainingWeight: remainingWeight

    };

    localStorage.setItem(

        "academicProfile",

        JSON.stringify(academicProfile)

    );

    localStorage.setItem(

        "remainingAssessments",

        JSON.stringify(
            remainingAssessmentCounts
        )

    );

    localStorage.setItem(

        "remainingAssessmentDetails",

        JSON.stringify(
            remainingAssessmentDetails
        )

    );

    localStorage.setItem(

        "factorPerformance",

        JSON.stringify(
            factorPerformance
        )

    );

    localStorage.setItem(

        "remainingAssessmentSessions",

        JSON.stringify(
            remainingSessions
        )

    );

    console.log(
        "Remaining Assessment Sessions:",
        remainingSessions
    );

    // ==========================================
    // Build Individual Remaining Assessment Sessions
    // ==========================================

    const remainingAssessmentSessions = [];

    remainingAssessmentDetails.forEach(item => {

        for (let i = 1; i <= item.remaining; i++) {

            remainingAssessmentSessions.push({

                category:
                    item.category,

                assessmentNumber:
                    i,

                weightPerAssessment:
                    item.weightPerAssessment

            });

        }

    });

    localStorage.setItem(

        "remainingAssessmentSessions",

        JSON.stringify(
            remainingAssessmentSessions
        )

    );

    document.getElementById("modelResults").innerHTML = `

        <div class="alert alert-success">

            <h4>Academic Profile</h4>

            <hr>

            <p>
                <strong>Current Participation Mark:</strong>
                ${totalParticipation.toFixed(2)}%
            </p>

            <p>
                <strong>Academic Standing:</strong>
                ${standing}
            </p>

            <p>
                <strong>Completed Assessments:</strong>
                ${completed}
            </p>

            <p>
                <strong>Remaining Assessments:</strong>
                ${remaining}
            </p>

        </div>

    `;

    // ==========================================
    // Algorithm 2
    // Build Participation Scenario Matrix (q)
    // ==========================================

    const participationScenarioMatrix = [

        {

            totalRemainingAssessments: remaining,

            remainingWeight: remainingWeight,

            assessments: remainingAssessmentDetails

                .filter(item => item.remaining > 0)

                .map(item => ({

                    category: item.category,

                    remaining: item.remaining,

                    weightPerAssessment:
                        item.weightPerAssessment

                }))

        }

    ];

    localStorage.setItem(

        "participationScenarioMatrix",

        JSON.stringify(
            participationScenarioMatrix
        )

    );

    // ==========================================
    // Algorithm 2
    // Generate 2^s Participation Scenarios
    // ==========================================

    const improvementScenarios = [];

    const s =
        remainingSessions.length;

    const totalScenarios =
        Math.pow(2, s);

    for (
        let scenarioNumber = 0;
        scenarioNumber < totalScenarios;
        scenarioNumber++
    ) {

        const participationScenario = [];

        for (let i = 0; i < s; i++) {

            const participated =
                (scenarioNumber & (1 << i)) !== 0;

            participationScenario.push({

                session:
                    remainingSessions[i].session,

                participated:
                    participated,

                assessments:
                    remainingSessions[i].assessments

            });

        }

        improvementScenarios.push({

            scenario:
                scenarioNumber + 1,

            participation:
                participationScenario

        });

    }


    // ==========================================
    // Algorithm 2
    // Calculate Factor Participation Counts (ηj)
    // ==========================================

    improvementScenarios.forEach(scenario => {

        const participationCounts = {};

        scenario.participation.forEach(session => {

            if (!session.participated) {

                return;

            }

            session.assessments.forEach(assessment => {

                const category =
                    assessment.category;

                if (!participationCounts[category]) {

                    participationCounts[category] = 0;

                }

                participationCounts[category]++;

            });

        });

        scenario.participationCounts =
            participationCounts;

    });


    // ==========================================
    // Save Initial Participation Scenarios
    // ==========================================

    localStorage.setItem(

        "improvementScenarios",

        JSON.stringify(
            improvementScenarios
        )

    );


    // ==========================================
    // Algorithm 2
    // Evaluate Participation Scenarios
    // ==========================================

    const evaluatedScenarios = [];

    improvementScenarios.forEach(scenario => {

        let scenarioWeight = 0;

        scenario.participation.forEach(session => {

            if (!session.participated) {

                return;

            }

            session.assessments.forEach(assessment => {

                scenarioWeight +=
                    Number(
                        assessment.weightPerAssessment
                    );

            });

        });

        const improvement =
            scenarioWeight;

        const targetParticipation =
            totalParticipation + improvement;

        evaluatedScenarios.push({

            scenario:
                scenario.scenario,

            participation:
                scenario.participation,

            participationCounts:
                scenario.participationCounts,

            scenarioWeight:
                Number(
                    scenarioWeight.toFixed(2)
                ),

            improvement:
                Number(
                    improvement.toFixed(2)
                ),

            targetParticipation:
                Number(
                    targetParticipation.toFixed(2)
                )

        });

    });

    // ==========================================
    // Save Evaluated Participation Scenarios
    // ==========================================

    localStorage.setItem(
        "evaluatedImprovementScenarios",
        JSON.stringify(
            evaluatedScenarios
        )
    );


    // ==========================================
    // Algorithm 2
    // Remove Duplicate Participation Outcomes
    // ==========================================

    const uniqueScenarios = [];

    const scenarioKeys = new Set();

    evaluatedScenarios.forEach(scenario => {

        const participationCounts =
            scenario.participationCounts;

        const key =
            Object.keys(participationCounts)
                .sort()
                .map(category =>
                    `${category}:${participationCounts[category]}`
                )
                .join("|");

        if (!scenarioKeys.has(key)) {

            scenarioKeys.add(key);

            uniqueScenarios.push({

                ...scenario,

                participationCounts:
                    participationCounts

            });

        }

    });


    // ==========================================
    // Save Unique Scenarios
    // ==========================================

    localStorage.setItem(

        "uniqueImprovementScenarios",

        JSON.stringify(
            uniqueScenarios
        )

    );

    const viewImprovementOptions =
        document.getElementById(
            "viewImprovementOptions"
        );

    if (viewImprovementOptions) {

        viewImprovementOptions.style.display =
            "inline-block";

    }

}



// ==========================================
// Phase 3 - Load Academic Profile
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const storedStudent =
        localStorage.getItem("studentModel");

    const storedProfile =
        localStorage.getItem("academicProfile");


    const remaining =
        JSON.parse(
            localStorage.getItem("remainingAssessments")
        );

    const summary =
        document.getElementById(
            "remainingAssessmentsSummary"
        );

    if (remaining && summary) {

        summary.innerHTML = "";

        Object.entries(remaining).forEach(([category, count]) => {

            summary.innerHTML += `

            <p>

                <strong>${category}:</strong>
                ${count}

            </p>

        `;

        });

    }
    if (!storedStudent || !storedProfile) {

        return;

    }

    const student =
        JSON.parse(storedStudent);

    const profile =
        JSON.parse(storedProfile);

    // --------------------------------------
    // Check that we are on Phase 3
    // --------------------------------------

    const phase3FirstName =
        document.getElementById("phase3FirstName");

    if (!phase3FirstName) {

        return;

    }



    // --------------------------------------
    // Populate Student Summary
    // --------------------------------------

    phase3FirstName.value =
        student.firstName;

    document.getElementById("phase3Surname").value =
        student.surname;

    document.getElementById("phase3StudentNumber").value =
        student.studentNumber;

    document.getElementById("phase3Module").value =
        student.module;

    // --------------------------------------
    // Populate Academic Profile
    // --------------------------------------

    document.getElementById("currentParticipation").innerHTML =

        profile.participationMark.toFixed(2) + "%";

    // --------------------------------------
    // Academic Standing Badge
    // --------------------------------------

    const standingBadge =
        document.getElementById("academicStanding");

    standingBadge.innerHTML =
        profile.academicStanding;



    // --------------------------------------
    // Progress Bar
    // --------------------------------------

    const progressBar =
        document.getElementById("participationProgress");

    progressBar.style.width =
        profile.participationMark + "%";

    progressBar.innerHTML =
        profile.participationMark.toFixed(1) + "%";

    progressBar.className = "progress-bar";

    if (profile.participationMark >= 75) {

        progressBar.classList.add("bg-success");

    }
    else if (profile.participationMark >= 50) {

        progressBar.classList.add("bg-warning");

    }
    else {

        progressBar.classList.add("bg-danger");

    }

    //document.getElementById("minimumImprovement").innerHTML = "0%";

    //document.getElementById("maximumImprovement").innerHTML =
    //   profile.remainingWeight.toFixed(2) + "%";

    // --------------------------------------
    // Improvement Range
    // --------------------------------------

    const scenarios =
        JSON.parse(
            localStorage.getItem(
                "evaluatedImprovementScenarios"
            )
        ) || [];

    console.log(
        "Phase 3 - Participation Scenarios:",
        scenarios
    );

    if (scenarios.length > 0) {

        const improvementValues = scenarios
            .map(scenario => Number(scenario.improvement))
            .filter(value => !isNaN(value));

        const minimumImprovement =
            Math.min(...improvementValues);

        const maximumImprovement =
            Math.max(...improvementValues);

        document.getElementById("minimumImprovement").innerHTML =
            minimumImprovement.toFixed(2) + "%";

        document.getElementById("maximumImprovement").innerHTML =
            maximumImprovement.toFixed(2) + "%";

    }


});

function generateImprovementOptions() {

    console.log("=================================");
    console.log("Phase 3 - Improvement Calculation");
    console.log("=================================");

    // ------------------------------------------
    // Load Student Model
    // ------------------------------------------

    const studentModel =
        JSON.parse(
            localStorage.getItem("studentModel")
        );

    console.log("Student Model:", studentModel);


    // ------------------------------------------
    // Load Academic Profile
    // ------------------------------------------

    const academicProfile =
        JSON.parse(
            localStorage.getItem("academicProfile")
        );

    console.log("Academic Profile:", academicProfile);


    // ------------------------------------------
    // Load Factor Performance
    // ------------------------------------------

    const factorPerformance =
        JSON.parse(
            localStorage.getItem("factorPerformance")
        );


    // ------------------------------------------
    // Load Remaining Assessment Sessions
    // ------------------------------------------

    const remainingSessions =
        JSON.parse(
            localStorage.getItem(
                "remainingAssessmentSessions"
            )
        );

    // ------------------------------------------
    // Load Participation Scenarios
    // ------------------------------------------

    const improvementScenarios =
        JSON.parse(
            localStorage.getItem(
                "improvementScenarios"
            )
        );


    // ------------------------------------------
    // Basic validation
    // ------------------------------------------

    if (!studentModel) {

        console.error(
            "studentModel not found in localStorage"
        );

        return;
    }

    if (!academicProfile) {

        console.error(
            "academicProfile not found in localStorage"
        );

        return;
    }

    if (!factorPerformance) {

        console.error(
            "factorPerformance not found in localStorage"
        );

        return;
    }

    if (!remainingSessions) {

        console.error(
            "remainingAssessmentSessions not found in localStorage"
        );

        return;
    }


    // ------------------------------------------
    // Current participation mark
    // ------------------------------------------

    const currentParticipation =
        Number(
            academicProfile.participationMark
        );

    console.log(
        "Current Participation:",
        currentParticipation
    );

    // ------------------------------------------
    // Desired Improvement (δ)
    // ------------------------------------------

    const deltaInput =
        document.getElementById("delta-input");

    if (!deltaInput) {

        console.error(
            "deltaInput element not found"
        );

        return;
    }

    const delta =
        Number(deltaInput.value);

    if (
        isNaN(delta) ||
        delta <= 0
    ) {

        alert(
            "Please enter a valid improvement target greater than 0%."
        );

        return;
    }

    console.log(
        "Desired Improvement (δ):",
        delta
    );

    // ------------------------------------------
    // Calculate Required Marks for Each Scenario
    // ------------------------------------------

    const scenarioPlans = [];

    improvementScenarios.forEach(scenario => {

        const requiredScores = [];

        factorPerformance.forEach(factor => {

            const category =
                factor.category;

            const participated =
                scenario.participation
                    .filter(item => item.participated)
                    .some(item =>
                        item.assessments.some(
                            assessment =>
                                assessment.category === category
                        )
                    );

            // No assessments remaining
            if (factor.remainingAssessments === 0) {

                requiredScores.push(null);

                return;

            }

            // Student does not participate
            // in this factor in this scenario
            if (!participated) {

                requiredScores.push(null);

                return;

            }

            const totalAssessments =
                Number(
                    factor.totalAssessments
                );

            const remainingAssessments =
                Number(
                    factor.remainingAssessments
                );

            const currentAverage =
                Number(
                    factor.currentAverage
                );

            // Number of assessments participated in
            const participatedCount =
                scenario.participation
                    .filter(item => item.participated)
                    .reduce(
                        (count, item) => {

                            return count +
                                item.assessments.filter(
                                    assessment =>
                                        assessment.category === category
                                ).length;

                        },
                        0
                    );

            const requiredMark =
                (
                    (delta * totalAssessments) +
                    (
                        remainingAssessments *
                        currentAverage
                    )
                ) /
                participatedCount;

            requiredScores.push(
                Number(
                    requiredMark.toFixed(2)
                )
            );

        });

        scenarioPlans.push({

            scenario:
                scenario.scenario,

            targetImprovement:
                delta,

            targetParticipation:
                Number(
                    (
                        currentParticipation +
                        delta
                    ).toFixed(2)
                ),

            requiredScores:
                requiredScores

        });

    });

    console.log(
        "Scenario Plans:",
        scenarioPlans
    );

    // ------------------------------------------
    // Determine Feasible Improvement Scenarios
    // ------------------------------------------

    const feasibleScenarios = [];

    scenarioPlans.forEach(plan => {

        // At least one assessment must be
        // participated in
        const hasParticipation =
            plan.requiredScores.some(
                score => score !== null
            );

        // Every required mark must be achievable
        const allMarksAchievable =
            plan.requiredScores.every(score => {

                // null means this factor is
                // not involved in this scenario
                if (score === null) {
                    return true;
                }

                return score >= 0 && score <= 100;

            });

        if (
            hasParticipation &&
            allMarksAchievable
        ) {

            feasibleScenarios.push(plan);

        }

    });

    console.log(
        "Feasible Improvement Scenarios:",
        feasibleScenarios
    );

    console.log(
        "Number of Feasible Scenarios:",
        feasibleScenarios.length
    );

    localStorage.setItem(
        "feasibleScenarios",
        JSON.stringify(feasibleScenarios)
    );

    // ------------------------------------------
    // Number of remaining assessments
    // ------------------------------------------

    const remaining =
        remainingSessions.length;

    console.log(
        "Remaining Assessments:",
        remaining
    );

    // ------------------------------------------
    // Display basic information
    // ------------------------------------------

    const plansContainer =
        document.getElementById(
            "improvementPlans"
        );

    if (!plansContainer) {

        console.error(
            "improvementPlans element not found"
        );

        return;
    }


    const improvementMessage =
        document.getElementById("improvementMessage");

    const scenarioResults =
        document.getElementById("scenarioResults");

    const scenarioTemplate =
        document.getElementById("scenarioTemplate");

    if (
        !improvementMessage ||
        !scenarioResults ||
        !scenarioTemplate
    ) {

        console.error(
            "Phase 3 scenario display elements not found"
        );

        return;
    }


    // Clear previous results

    scenarioResults.innerHTML = "";


    // ------------------------------------------
    // No feasible scenarios
    // ------------------------------------------

    if (feasibleScenarios.length === 0) {

        improvementMessage.className =
            "alert alert-warning";

        improvementMessage.innerHTML =
            "No feasible improvement plans were found " +
            "for the desired improvement.";

        return;
    }


    // ------------------------------------------
    // Feasible scenarios found
    // ------------------------------------------

    improvementMessage.className =
        "alert alert-success";

    improvementMessage.innerHTML =
        `<strong>${feasibleScenarios.length}</strong> feasible improvement plan(s) found.`;


    // ------------------------------------------
    // Render scenarios
    // ------------------------------------------

    feasibleScenarios.forEach(plan => {

        const scenario =
            scenarioTemplate.content.cloneNode(true);


        // --------------------------------------
        // Scenario number
        // --------------------------------------

        const scenarioTitle =
            scenario.querySelector(
                ".scenario-title"
            );

        scenarioTitle.textContent =
            `Scenario ${plan.scenario}`;


        // --------------------------------------
        // Improvement
        // --------------------------------------

        const scenarioImprovement =
            scenario.querySelector(
                ".scenario-improvement"
            );

        scenarioImprovement.textContent =
            `+${plan.targetImprovement.toFixed(2)}%`;


        // --------------------------------------
        // Target participation
        // --------------------------------------

        const scenarioTarget =
            scenario.querySelector(
                ".scenario-target"
            );

        scenarioTarget.textContent =
            `${plan.targetParticipation.toFixed(2)}%`;


        // --------------------------------------
        // Required scores
        // --------------------------------------

        const scenarioScores =
            scenario.querySelector(
                ".scenario-scores"
            );


        factorPerformance.forEach(
            (factor, index) => {

                const requiredScore =
                    plan.requiredScores[index];


                const scoreRow =
                    document.createElement("p");


                const category =
                    factor.category;


                if (requiredScore === null) {

                    scoreRow.innerHTML =
                        `<strong>${category}:</strong> —`;

                }
                else {

                    scoreRow.innerHTML =
                        `<strong>${category}:</strong> ${requiredScore.toFixed(2)}%`;

                }


                scenarioScores.appendChild(
                    scoreRow
                );

            }
        );


        scenarioResults.appendChild(
            scenario
        );

    });

}

const showOptionsButton =
    document.getElementById("showOptions");

if (showOptionsButton) {

    showOptionsButton.addEventListener(
        "click",
        generateImprovementOptions
    );

}

// ==========================================
// Phase 4 - Student Performance Summary
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------
    // Check that we are on Phase 4
    // --------------------------------------

    const phase4FirstName =
        document.getElementById("phase4FirstName");

    if (!phase4FirstName) {
        return;
    }

    console.log("=================================");
    console.log("Phase 4 - Student Performance Summary");
    console.log("=================================");


    // ======================================
    // LOAD STUDENT MODEL
    // ======================================

    const storedStudent =
        localStorage.getItem("studentModel");

    if (!storedStudent) {

        console.error(
            "studentModel not found in localStorage"
        );

        return;
    }

    const student =
        JSON.parse(storedStudent);

    console.log(
        "Student Model:",
        student
    );


    // ======================================
    // STUDENT INFORMATION
    // ======================================

    document.getElementById(
        "phase4FirstName"
    ).value =
        student.firstName || "";

    document.getElementById(
        "phase4Surname"
    ).value =
        student.surname || "";

    document.getElementById(
        "phase4StudentNumber"
    ).value =
        student.studentNumber || "";

    document.getElementById(
        "phase4Module"
    ).value =
        student.module || "";


    // ======================================
    // LOAD ACADEMIC PROFILE
    // ======================================

    const storedProfile =
        localStorage.getItem("academicProfile");

    if (!storedProfile) {

        console.error(
            "academicProfile not found in localStorage"
        );

        return;
    }

    const academicProfile =
        JSON.parse(storedProfile);

    console.log(
        "Academic Profile:",
        academicProfile
    );


    // ======================================
    // ACADEMIC PROFILE
    // ======================================

    const participation =
        Number(
            academicProfile.participationMark || 0
        );

    const participationElement =
        document.getElementById(
            "phase4ParticipationMark"
        );

    if (participationElement) {

        participationElement.textContent =
            participation.toFixed(2) + "%";
    }


    const standingElement =
        document.getElementById(
            "phase4AcademicStanding"
        );

    if (standingElement) {

        standingElement.textContent =
            academicProfile.academicStanding ||
            "Not Calculated";
    }


    // ======================================
    // PARTICIPATION PROGRESS
    // ======================================

    const progressBar =
        document.getElementById(
            "phase4ParticipationProgress"
        );

    if (progressBar) {

        const progress =
            Math.min(
                Math.max(participation, 0),
                100
            );

        progressBar.style.width =
            progress + "%";

        progressBar.textContent =
            participation.toFixed(1) + "%";
    }


    // ======================================
    // LOAD FACTOR PERFORMANCE
    // ======================================

    const storedFactors =
        localStorage.getItem("factorPerformance");

    if (!storedFactors) {

        console.error(
            "factorPerformance not found in localStorage"
        );

        return;
    }

    const factorPerformance =
        JSON.parse(storedFactors);

    console.log(
        "Factor Performance:",
        factorPerformance
    );


    // ======================================
    // COMPLETED / REMAINING ASSESSMENTS
    // ======================================

    let completedAssessments = 0;
    let remainingAssessments = 0;

    factorPerformance.forEach(factor => {

        completedAssessments +=
            Number(
                factor.completedAssessments || 0
            );

        remainingAssessments +=
            Number(
                factor.remainingAssessments || 0
            );

    });


    const completedElement =
        document.getElementById(
            "phase4CompletedAssessments"
        );

    if (completedElement) {

        completedElement.textContent =
            completedAssessments;
    }


    const remainingElement =
        document.getElementById(
            "phase4RemainingAssessments"
        );

    if (remainingElement) {

        remainingElement.textContent =
            remainingAssessments;
    }


    // ======================================
    // ASSESSMENT FRAMEWORK
    // ======================================
    //
    // IMPORTANT:
    // The assessment framework belongs to
    // studentModel.assessments.
    //
    // factorPerformance contains derived
    // performance information, not the original
    // assessment framework.
    // ======================================

    const frameworkTable =
        document.getElementById(
            "assessmentFrameworkTable"
        );

    if (frameworkTable) {

        frameworkTable.innerHTML = "";

        const assessments =
            student.assessments || [];

        if (assessments.length === 0) {

            frameworkTable.innerHTML = `
                <tr>
                    <td
                        colspan="3"
                        class="text-center text-muted">
                        No assessment framework available.
                    </td>
                </tr>
            `;

        }
        else {

            assessments.forEach(
                assessment => {

                    const row =
                        document.createElement("tr");


                    // Assessment category
                    const categoryCell =
                        document.createElement("td");

                    categoryCell.textContent =
                        assessment.category || "—";


                    // Number of assessments
                    const numberCell =
                        document.createElement("td");

                    numberCell.textContent =
                        assessment.quantity ?? "—";


                    // Total weight
                    const weightCell =
                        document.createElement("td");

                    const weight =
                        Number(
                            assessment.weight
                        );

                    weightCell.textContent =
                        Number.isFinite(weight)
                            ? weight + "%"
                            : "—";


                    row.appendChild(
                        categoryCell
                    );

                    row.appendChild(
                        numberCell
                    );

                    row.appendChild(
                        weightCell
                    );

                    frameworkTable.appendChild(
                        row
                    );

                }
            );

        }

    }


    // ======================================
    // EXISTING ASSESSMENT MARKS
    // ======================================
    //
    // factorPerformance currently contains:
    //
    // category
    // totalAssessments
    // completedAssessments
    // remainingAssessments
    // currentAverage
    // weight
    // weightPerAssessment
    //
    // It does NOT contain individual
    // assessment records.
    //
    // Therefore we use the available
    // category-level performance data.
    // ======================================

    const existingMarksTable =
        document.getElementById(
            "existingMarksTable"
        );

    if (existingMarksTable) {

        existingMarksTable.innerHTML = "";

        let rowsAdded = 0;

        factorPerformance.forEach(
            factor => {

                const completed =
                    Number(
                        factor.completedAssessments || 0
                    );

                const total =
                    Number(
                        factor.totalAssessments || 0
                    );

                const weightPerAssessment =
                    Number(
                        factor.weightPerAssessment || 0
                    );

                const currentAverage =
                    Number(
                        factor.currentAverage
                    );


                // ----------------------------------
                // Completed assessments
                // ----------------------------------

                if (completed > 0) {

                    /*
                     * If there is only one completed
                     * assessment, the category average
                     * is also that assessment's mark.
                     */

                    if (completed === 1) {

                        const row =
                            document.createElement("tr");


                        const assessmentCell =
                            document.createElement("td");

                        assessmentCell.textContent =
                            `${factor.category} 1`;


                        const weightCell =
                            document.createElement("td");

                        weightCell.textContent =
                            Number.isFinite(
                                weightPerAssessment
                            )
                                ? weightPerAssessment + "%"
                                : "—";


                        const markCell =
                            document.createElement("td");


                        if (
                            Number.isFinite(
                                currentAverage
                            )
                        ) {

                            markCell.textContent =
                                currentAverage + "%";

                        }
                        else {

                            markCell.textContent =
                                "—";
                        }


                        row.appendChild(
                            assessmentCell
                        );

                        row.appendChild(
                            weightCell
                        );

                        row.appendChild(
                            markCell
                        );

                        existingMarksTable.appendChild(
                            row
                        );

                        rowsAdded++;

                    }

                    /*
                     * If multiple assessments have been
                     * completed, we do not pretend that the
                     * category average represents every
                     * individual mark.
                     *
                     * Instead, display the category average.
                     */

                    else {

                        const row =
                            document.createElement("tr");


                        const assessmentCell =
                            document.createElement("td");

                        assessmentCell.textContent =
                            `${factor.category} (${completed} completed)`;


                        const weightCell =
                            document.createElement("td");

                        weightCell.textContent =
                            Number.isFinite(
                                weightPerAssessment
                            )
                                ? weightPerAssessment + "%"
                                : "—";


                        const markCell =
                            document.createElement("td");

                        markCell.textContent =
                            Number.isFinite(
                                currentAverage
                            )
                                ? currentAverage + "% average"
                                : "—";


                        row.appendChild(
                            assessmentCell
                        );

                        row.appendChild(
                            weightCell
                        );

                        row.appendChild(
                            markCell
                        );

                        existingMarksTable.appendChild(
                            row
                        );

                        rowsAdded++;

                    }

                }


                // ----------------------------------
                // Remaining assessments
                // ----------------------------------

                const remaining =
                    Number(
                        factor.remainingAssessments || 0
                    );

                if (remaining > 0) {

                    for (
                        let i = 1;
                        i <= remaining;
                        i++
                    ) {

                        const row =
                            document.createElement("tr");


                        const assessmentCell =
                            document.createElement("td");

                        assessmentCell.textContent =
                            `${factor.category} — Remaining`;


                        const weightCell =
                            document.createElement("td");

                        weightCell.textContent =
                            Number.isFinite(
                                weightPerAssessment
                            )
                                ? weightPerAssessment + "%"
                                : "—";


                        const markCell =
                            document.createElement("td");

                        markCell.textContent =
                            "—";


                        row.appendChild(
                            assessmentCell
                        );

                        row.appendChild(
                            weightCell
                        );

                        row.appendChild(
                            markCell
                        );

                        existingMarksTable.appendChild(
                            row
                        );

                        rowsAdded++;

                    }

                }

            }
        );


        if (rowsAdded === 0) {

            existingMarksTable.innerHTML = `
                <tr>
                    <td
                        colspan="3"
                        class="text-center text-muted">
                        No assessment marks available.
                    </td>
                </tr>
            `;
        }

    }


    // --------------------------------------
    // Feasible Improvement Scenarios
    // --------------------------------------

    const storedFeasibleScenarios =
        localStorage.getItem(
            "feasibleScenarios"
        );

    console.log(
        "Feasible Scenarios:",
        storedFeasibleScenarios
    );

    if (storedFeasibleScenarios) {

        const feasibleScenarios =
            JSON.parse(
                storedFeasibleScenarios
            );

        console.log(
            "Phase 4 - Feasible Scenarios:",
            feasibleScenarios
        );

        populatePhase4Scenarios(
            feasibleScenarios
        );

    }


    // ======================================
    // CSV EXPORT
    // ======================================

    const saveCsvButton =
        document.getElementById(
            "saveCsv"
        );

    if (saveCsvButton) {

        saveCsvButton.addEventListener(
            "click",
            saveStudentDataAsCSV
        );

    }


    console.log(
        "Phase 4 loaded successfully."
    );

});


// ==========================================
// Phase 4 - Populate Improvement Scenarios
// ==========================================

function populatePhase4Scenarios(
    feasibleScenarios
) {

    const scenarioTable =
        document.getElementById(
            "phase4ScenarioTable"
        );

    const targetImprovementElement =
        document.getElementById(
            "phase4TargetImprovement"
        );

    const targetParticipationElement =
        document.getElementById(
            "phase4TargetParticipation"
        );


    if (!scenarioTable) {

        console.error(
            "phase4ScenarioTable not found."
        );

        return;
    }


    scenarioTable.innerHTML = "";


    // --------------------------------------
    // No feasible scenarios
    // --------------------------------------

    if (
        !Array.isArray(feasibleScenarios) ||
        feasibleScenarios.length === 0
    ) {

        scenarioTable.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="text-center text-muted">

                    No feasible improvement scenarios
                    are currently available.

                </td>
            </tr>
        `;

        if (targetImprovementElement) {
            targetImprovementElement.textContent = "—";
        }

        if (targetParticipationElement) {
            targetParticipationElement.textContent = "—";
        }

        return;
    }


    // --------------------------------------
    // Load the SAME remaining assessments
    // used by Phase 3
    // --------------------------------------

    const storedSessions =
        localStorage.getItem(
            "remainingAssessmentSessions"
        );


    const remainingAssessmentSessions =
        storedSessions
            ? JSON.parse(storedSessions)
            : [];


    console.log(
        "Phase 4 - Remaining Assessment Sessions:",
        remainingAssessmentSessions
    );


    // --------------------------------------
    // Target information
    // --------------------------------------

    const firstScenario =
        feasibleScenarios[0];


    const targetImprovement =
        Number(
            firstScenario.targetImprovement
        );


    const targetParticipation =
        Number(
            firstScenario.targetParticipation
        );


    if (targetImprovementElement) {

        targetImprovementElement.textContent =
            Number.isFinite(targetImprovement)
                ? "+" + targetImprovement + "%"
                : "—";
    }


    if (targetParticipationElement) {

        targetParticipationElement.textContent =
            Number.isFinite(targetParticipation)
                ? targetParticipation.toFixed(1) + "%"
                : "—";
    }


    // --------------------------------------
    // Render feasible scenarios
    // --------------------------------------

    feasibleScenarios.forEach(
        scenario => {

            const requiredScores =
                Array.isArray(
                    scenario.requiredScores
                )
                    ? scenario.requiredScores
                    : [];


            requiredScores.forEach(
                (requiredScore, index) => {

                    /*
                     * IMPORTANT:
                     *
                     * null means that this assessment
                     * does not require a specific mark
                     * for this scenario.
                     *
                     * We therefore do NOT display a row
                     * for null values.
                     */

                    if (
                        requiredScore === null ||
                        requiredScore === undefined
                    ) {

                        return;
                    }


                    const assessment =
                        remainingAssessmentSessions[index];


                    if (!assessment) {

                        console.warn(
                            "No matching assessment found for required score:",
                            {
                                scenario:
                                    scenario.scenario,

                                index:
                                    index,

                                requiredScore:
                                    requiredScore
                            }
                        );

                        return;
                    }


                    // ----------------------------------
                    // Create row
                    // ----------------------------------

                    const row =
                        document.createElement("tr");


                    // ----------------------------------
                    // Scenario
                    // ----------------------------------

                    const scenarioCell =
                        document.createElement("td");

                    scenarioCell.textContent =
                        `Scenario ${scenario.scenario}`;


                    // ----------------------------------
                    // Assessment Category
                    // ----------------------------------

                    const categoryCell =
                        document.createElement("td");


                    const assessmentNumber =
                        assessment.assessmentNumber;


                    categoryCell.textContent =
                        assessmentNumber
                            ? `${assessment.category} ${assessmentNumber}`
                            : assessment.category;


                    // ----------------------------------
                    // Required Mark
                    // ----------------------------------

                    const requiredMarkCell =
                        document.createElement("td");


                    requiredMarkCell.textContent =
                        Number(
                            requiredScore
                        ).toFixed(1) + "%";


                    // ----------------------------------
                    // Target Participation
                    // ----------------------------------

                    const targetCell =
                        document.createElement("td");


                    targetCell.textContent =
                        Number.isFinite(
                            Number(
                                scenario.targetParticipation
                            )
                        )
                            ? Number(
                                scenario.targetParticipation
                            ).toFixed(1) + "%"
                            : "—";


                    // ----------------------------------
                    // Add cells
                    // ----------------------------------

                    row.appendChild(
                        scenarioCell
                    );

                    row.appendChild(
                        categoryCell
                    );

                    row.appendChild(
                        requiredMarkCell
                    );

                    row.appendChild(
                        targetCell
                    );


                    scenarioTable.appendChild(
                        row
                    );

                }
            );

        }
    );
}

// ======================================
// CSV EXPORT
// ======================================

function saveStudentDataAsCSV() {

    // --------------------------------------
    // Load required data
    // --------------------------------------

    const student =
        JSON.parse(
            localStorage.getItem("studentModel")
        );

    const factorPerformance =
        JSON.parse(
            localStorage.getItem("factorPerformance")
        );

    const remainingAssessmentSessions =
        JSON.parse(
            localStorage.getItem(
                "remainingAssessmentSessions"
            )
        );


    // --------------------------------------
    // Validate required data
    // --------------------------------------

    if (!student) {
        console.error(
            "studentModel not found in localStorage."
        );
        return;
    }

    if (!Array.isArray(factorPerformance)) {
        console.error(
            "factorPerformance not found or invalid."
        );
        return;
    }

    if (!Array.isArray(remainingAssessmentSessions)) {
        console.error(
            "remainingAssessmentSessions not found or invalid."
        );
        return;
    }


    // --------------------------------------
    // CSV rows
    // --------------------------------------

    const rows = [];


    // ======================================
    // STUDENT INFORMATION
    // ======================================

    rows.push([
        "STUDENT INFORMATION"
    ]);

    rows.push([
        "First Name",
        "Surname",
        "Student Number",
        "Module"
    ]);

    rows.push([
        student.firstName || "",
        student.surname || "",
        student.studentNumber ||
        student.studentNum ||
        "",
        student.module || ""
    ]);


    // Blank line
    rows.push([]);


    // ======================================
    // ASSESSMENT FRAMEWORK AND MARKS
    // ======================================

    rows.push([
        "ASSESSMENT FRAMEWORK AND MARKS"
    ]);

    rows.push([
        "Assessment",
        "Number of Assessments",
        "Total Weight",
        "Marks"
    ]);


    // --------------------------------------
    // Existing assessments
    // --------------------------------------

    factorPerformance.forEach(
        factor => {

            const category =
                factor.category;

            const totalAssessments =
                Number(
                    factor.totalAssessments || 0
                );

            const totalWeight =
                factor.weight !== undefined &&
                    factor.weight !== null &&
                    factor.weight !== ""
                    ? factor.weight
                    : "-";

            const completedAssessments =
                Number(
                    factor.completedAssessments || 0
                );

            /*
             * Existing marks come from the
             * currentAverage stored in
             * factorPerformance.
             *
             * No calculation is performed here.
             * We simply transfer the stored value.
             */

            const existingMark =
                completedAssessments > 0
                    ? factor.currentAverage
                    : null;


            // ----------------------------------
            // Existing assessment rows
            // ----------------------------------

            for (
                let i = 1;
                i <= completedAssessments;
                i++
            ) {

                rows.push([
                    `${category} ${i}`,
                    totalAssessments,
                    totalWeight,
                    existingMark !== null &&
                        existingMark !== undefined &&
                        existingMark !== ""
                        ? existingMark
                        : "-"
                ]);

            }


            // ----------------------------------
            // Remaining assessment rows
            // ----------------------------------

            const remainingSessions =
                remainingAssessmentSessions.filter(
                    session =>
                        session.category === category
                );


            remainingSessions.forEach(
                session => {

                    const assessmentNumber =
                        session.assessmentNumber ||
                        session.number;

                    rows.push([
                        `${category} ${assessmentNumber}`,
                        totalAssessments,
                        totalWeight,
                        "-"
                    ]);

                }
            );

        }
    );


    // ======================================
    // Convert rows to CSV
    // ======================================

    const csvContent =
        rows
            .map(row =>
                row
                    .map(value => {

                        if (
                            value === null ||
                            value === undefined
                        ) {
                            return "";
                        }

                        const text =
                            String(value);

                        /*
                         * Escape CSV values containing
                         * commas, quotes, or new lines.
                         */

                        if (
                            text.includes(",") ||
                            text.includes('"') ||
                            text.includes("\n")
                        ) {

                            return `"${text.replace(
                                /"/g,
                                '""'
                            )}"`;

                        }

                        return text;

                    })
                    .join(",")
            )
            .join("\n");


    // ======================================
    // Download CSV
    // ======================================

    const blob =
        new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "NWU_student_performance_summary.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);


    console.log(
        "Student performance CSV exported successfully."
    );

    const csvDownloadMessage =
        document.getElementById(
            "csvDownloadMessage"
        );

    if (csvDownloadMessage) {

        csvDownloadMessage.textContent =
            "CSV file downloaded successfully: NWU_student_performance_summary.csv";

        csvDownloadMessage.classList.remove(
            "d-none"
        );

        setTimeout(() => {

            csvDownloadMessage.classList.add(
                "d-none"
            );

        }, 5000);
    }
}