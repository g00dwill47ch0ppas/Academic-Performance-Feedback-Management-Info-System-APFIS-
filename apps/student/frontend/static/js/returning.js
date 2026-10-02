// ==========================================
// Returning Student - CSV Import
// ==========================================

console.log("=================================");
console.log("Returning.js loaded successfully.");
console.log("=================================");


// ==========================================
// Returning Student - CSV Import
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    
    const csvFileInput =
        document.getElementById("CsvFile");

    const importButton =
        document.getElementById("importCsv");


    if (!csvFileInput || !importButton) {
        return;
    }


    // --------------------------------------
    // Import CSV
    // --------------------------------------

    importButton.addEventListener("click", () => {

        const file =
            csvFileInput.files[0];


        if (!file) {

            alert(
                "Please select your saved CSV file."
            );

            return;
        }


        if (
            !file.name
                .toLowerCase()
                .endsWith(".csv")
        ) {

            alert(
                "Please select a valid CSV file."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = event => {

            try {

                const csv =
                    event.target.result;


                const lines =
                    csv
                        .split(/\r?\n/)
                        .map(line => line.trim())
                        .filter(line => line !== "");


                // --------------------------------------
                // Find CSV sections
                // --------------------------------------

                const studentSection =
                    lines.indexOf(
                        "STUDENT INFORMATION"
                    );


                const assessmentSection =
                    lines.indexOf(
                        "ASSESSMENT FRAMEWORK AND MARKS"
                    );


                if (
                    studentSection === -1 ||
                    assessmentSection === -1
                ) {

                    alert(
                        "This does not appear to be a valid Student Performance Assistant CSV file."
                    );

                    return;
                }


                // --------------------------------------
                // Student Information
                // --------------------------------------

                const studentValues =
                    lines[
                        studentSection + 2
                    ];


                const studentFields =
                    studentValues.split(",");


                if (
                    studentFields.length < 4
                ) {

                    alert(
                        "The student information in the CSV is incomplete."
                    );

                    return;
                }


                const firstName =
                    studentFields[0].trim();


                const surname =
                    studentFields[1].trim();


                const studentNumber =
                    studentFields[2].trim();


                const module =
                    studentFields[3].trim();


                // --------------------------------------
                // Assessment rows
                // --------------------------------------

                const assessmentRows =
                    lines.slice(
                        assessmentSection + 2
                    );


                if (
                    assessmentRows.length === 0
                ) {

                    alert(
                        "No assessment information was found in the CSV file."
                    );

                    return;
                }


                // --------------------------------------
                // Store individual assessment marks
                // --------------------------------------

                const importedMarks = [];


                assessmentRows.forEach(row => {

                    const fields =
                        row.split(",");


                    const assessment =
                        fields[0]
                            ? fields[0].trim()
                            : "";


                    const quantity =
                        Number(
                            fields[1]
                                ? fields[1].trim()
                                : 0
                        );


                    const weight =
                        fields[2]
                            ? fields[2].trim()
                            : "";


                    const mark =
                        fields[3]
                            ? fields[3].trim()
                            : "-";


                    importedMarks.push({

                        assessment:
                            assessment,

                        quantity:
                            quantity,

                        weight:
                            weight,

                        mark:
                            mark === "-"
                                ? ""
                                : mark

                    });

                });


                // --------------------------------------
                // Reconstruct studentModel
                // --------------------------------------

                const assessmentMap = {};


                importedMarks.forEach(item => {

                    /*
                     * Remove the assessment number
                     * from names such as:
                     *
                     * Class Test 1
                     * Class Test 2
                     * Assignment 1
                     *
                     * while preserving categories such as:
                     *
                     * Semester Test
                     * Project
                     */

                    const match =
                        item.assessment.match(
                            /^(.*?)(?:\s+\d+)?$/
                        );


                    const category =
                        match
                            ? match[1].trim()
                            : item.assessment;


                    if (
                        !assessmentMap[category]
                    ) {

                        assessmentMap[category] = {

                            category:
                                category,

                            quantity:
                                item.quantity,

                            weight:
                                item.weight

                        };

                    }

                });


                const studentModel = {

                    firstName:
                        firstName,

                    surname:
                        surname,

                    studentNumber:
                        studentNumber,

                    module:
                        module,

                    assessments:
                        Object.values(
                            assessmentMap
                        )

                };


                // --------------------------------------
                // Save student model
                // --------------------------------------

                localStorage.setItem(
                    "studentModel",
                    JSON.stringify(
                        studentModel
                    )
                );


                // --------------------------------------
                // Save imported marks separately
                // --------------------------------------

                localStorage.setItem(
                    "returningAssessmentMarks",
                    JSON.stringify(
                        importedMarks
                    )
                );


                console.log(
                    "Returning student model:",
                    studentModel
                );


                console.log(
                    "Imported assessment marks:",
                    importedMarks
                );


                // --------------------------------------
                // Continue to Phase 2
                // --------------------------------------

                window.location.href =
                    "/phase2";

            }
            catch (error) {

                console.error(
                    "CSV import error:",
                    error
                );

                alert(
                    "The CSV file could not be imported. Please make sure you are using the CSV file generated by the Student Performance Assistant."
                );

            }

        };


        reader.onerror = () => {

            alert(
                "The CSV file could not be read."
            );

        };


        reader.readAsText(file);

    });

});