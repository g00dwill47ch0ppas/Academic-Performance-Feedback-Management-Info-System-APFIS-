NWU Student Performance Assistant

Overview

The NWU Student Performance Assistant is a Flask-based webapplication designed to help North-West University students capture,review, and understand their academic performance.

The application follows a four-phase workflow:

Phase 0 -- Welcome

Phase 1 -- Assessment Plan

Phase 2 -- Academic Profile

Phase 3 -- Improvement Options

Phase 4 -- Student Performance Summary

It also supports a Returning Student workflow. A student can importa CSV previously exported by the application and continue from Phase 2.

Objectives

The application is designed to:

Capture student information.

Capture a module's assessment structure.

Record existing assessment marks.

Identify completed and remaining assessments.

Generate an academic profile.

Evaluate academic improvement scenarios.

Display feasible improvement scenarios.

Provide a read-only final summary.

Export student and assessment information to CSV.

Restore a saved student model from an exported CSV.

Application Workflow

Phase 0 -- Welcome

Phase 0 is the application's entry point.

The student chooses between:

New Student

Starts the normal workflow and navigates to:

/phase1

Returning Student

Allows the student to import a previously saved CSV and navigates to:

/returning

After a valid CSV is imported, the application reconstructs the studentmodel, stores it in localStorage, and automatically navigates to Phase2.

Phase 1 -- Assessment Plan

Phase 1 captures:

First Name

Surname

Student Number

Module

The student then defines the module's assessment categories, quantities,and total weights.

Example:

Category          Quantity   Weight

Semester Test            1      40%Class Test               3      30%Assignment               2      10%Project                  1      20%

The resulting model is stored under:

studentModel

Example:

{
    "firstName": "Thami",
    "surname": "Ndlak",
    "studentNumber": "123456",
    "module": "MTHS111",
    "assessments": [
        {
            "category": "Semester Test",
            "quantity": 1,
            "weight": "40"
        },
        {
            "category": "Class Test",
            "quantity": "3",
            "weight": "30"
        },
        {
            "category": "Project",
            "quantity": 1,
            "weight": "20"
        },
        {
            "category": "Assignment",
            "quantity": "2",
            "weight": "10"
        }
    ]
}

Phase 2 -- Academic Profile

Phase 2 loads the studentModel from browser localStorage.

Student information is displayed as read-only fields.

The assessment structure is expanded into individual assessments.

For example:

Semester Test
Class Test 1
Class Test 2
Class Test 3
Assignment 1
Assignment 2
Project

The student enters marks for assessments that have already beencompleted.

Future assessments can remain blank.

The student selects Generate Model to run the existingacademic-profile calculations.

The calculation logic belongs to the existing application workflow andshould not be duplicated by later phases.

Phase 3 -- Improvement Options

Phase 3 evaluates possible improvement scenarios using the application'sexisting academic model.

Scenario-related information is stored in several localStorageobjects, including:

improvementScenarios
uniqueImprovementScenarios
evaluatedImprovementScenarios
scenariosWithRequiredMarks
participationScenarioMatrix
feasibleScenarios

The most important object for Phase 4 is:

feasibleScenarios

It contains only the scenarios that the existing Phase 3 logicdetermined to be feasible.

Example:

[
    {
        "scenario": 4,
        "targetImprovement": 10,
        "targetParticipation": 57.3,
        "requiredScores": [
            null,
            92,
            null,
            null
        ]
    }
]

Phase 4 does not recalculate these results.

It displays the feasible scenarios produced by Phase 3.

Phase 4 -- Student Performance Summary

Phase 4 is a read-only summary.

Its purpose is to display results already produced by previous phases.

Important Rule

Phase 4 must not introduce new academic calculations.

The principle is:

Calculate once, display many times.

Phase 3 calculates improvement scenarios.

Phase 4 displays the feasible scenarios.

The CSV export contains student and assessment information only.

Phase 4 Sections

Student Information

Displays:

First Name

Surname

Student Number

Module

Assessment Framework

Displays:

Assessment category

Number of assessments

Total weight

Existing Assessment Marks

Displays:

Assessment

Weight

Existing mark

An assessment without a recorded mark is displayed as:

—

Academic Profile

Displays existing calculated information such as:

Current participation

Academic standing

Completed assessments

Remaining assessments

Participation progress

Improvement Scenarios

Displays the feasible scenarios stored by Phase 3.

No new scenario calculations are performed in Phase 4.

CSV Export

The Phase 4 CSV function deliberately exports only:

Student information

Assessment framework

Existing and non-existing assessment marks

It does not export academic calculations or improvement-scenariocalculations.

The filename is:

NWU_student_performance_summary.csv

The required CSV structure is:

STUDENT INFORMATION
First Name,Surname,Student Number,Module
Thami,Ndlak,123456,MTHS111

ASSESSMENT FRAMEWORK AND MARKS
Assessment,Number of Assessments,Total Weight, Marks
Semester Test,1,40,88
Class Test 1,3,30,77
Class Test 2,3,30,-
Class Test 3,3,30,-
Assignment 1,2,10,88
Assignment 2,2,10,-
Project,1,20,-

The - symbol means that the assessment does not currently have anexisting mark.

The CSV export uses:

factorPerformance
remainingAssessmentSessions

to obtain the assessment structure, weights, and remaining assessmentinformation.

Returning Student Workflow

The Returning Student workflow restores the information needed by Phase2.

Phase 0
   |
   v
Returning Student
   |
   v
Select CSV
   |
   v
Import CSV
   |
   v
Validate and parse CSV
   |
   v
Reconstruct studentModel
   |
   v
Save studentModel to localStorage
   |
   v
Navigate to Phase 2
   |
   v
Phase 2 loads studentModel

The returning workflow does not create a separate academic calculationsystem.

It restores the student's information and assessment/mark data so thatthe normal Phase 2 workflow can continue.

Returning Student JavaScript

The returning workflow is handled by:

frontend/static/js/returning.js

Its responsibilities are:

Detect the Returning Student page.

Find the CSV input and import button.

Read the selected CSV.

Validate the expected CSV format.

Extract student information.

Extract assessment information.

Extract existing marks.

Reconstruct studentModel.

Save the model to localStorage.

Navigate to Phase 2.

The main application behaviour remains in:

frontend/static/js/app.js

Local Storage Data Flow

The application uses browser localStorage to transfer informationbetween phases.

Important keys include:

studentModel
academicProfile
factorPerformance
remainingAssessmentSessions
remainingAssessmentDetails
improvementScenarios
uniqueImprovementScenarios
scenariosWithRequiredMarks
evaluatedImprovementScenarios
feasibleScenarios
remainingAssessments
participationScenarioMatrix

The general flow is:

Phase 1
   |
   | studentModel
   v
Phase 2
   |
   +--> academicProfile
   |
   +--> factorPerformance
   |
   +--> remainingAssessmentSessions
   |
   v
Phase 3
   |
   +--> improvement scenarios
   |
   +--> feasibleScenarios
   |
   v
Phase 4

Key Data Objects

studentModel

Contains student information and assessment structure.

factorPerformance

Contains assessment-category performance and weighting information.

Example:

{
    "category": "Semester Test",
    "totalAssessments": 1,
    "completedAssessments": 1,
    "remainingAssessments": 0,
    "currentAverage": 88,
    "weight": 40,
    "weightPerAssessment": 40
}

academicProfile

Contains the academic profile generated by the existing calculationprocess.

remainingAssessmentSessions

Contains information about future assessments.

feasibleScenarios

Contains the feasible improvement scenarios generated by Phase 3.

Project Structure

A simplified structure is:

Student-Performance-Assistant/
│
├── backend/
│   ├── __init__.py
│   └── routes/
│       └── home.py
│
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   ├── animations.css
│   │   │   ├── base.css
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   ├── layout.css
│   │   │   ├── navbar.css
│   │   │   ├── responsive.css
│   │   │   ├── timeline.css
│   │   │   └── variables.css
│   │   │
│   │   └── js/
│   │       ├── app.js
│   │       └── returning.js
│   │
│   └── templates/
│       ├── layouts/
│       │   └── base.html
│       │
│       ├── components/
│       │   ├── footer.html
│       │   ├── hero.html
│       │   ├── navbar.html
│       │   └── welcome_cards.html
│       │
│       ├── index.html
│       ├── returning.html
│       ├── phase1.html
│       ├── phase2.html
│       ├── phase3.html
│       └── phase4.html
│
├── docs/
├── app.py
└── README.md

The structure may change as development continues.

Backend

The application uses Flask.

The main application entry point is:

app.py

The Flask application factory is located in:

backend/__init__.py

Routes are organised under:

backend/routes/

The frontend uses Flask/Jinja templates and Flask static files.

Frontend

The application uses:

HTML

CSS

JavaScript

Jinja templates

Bootstrap 5

Font Awesome

Google Fonts

The base template is:

frontend/templates/layouts/base.html

Pages extend this layout using:

{% extends "layouts/base.html" %}

Reusable components include:

navbar.html
footer.html
hero.html
welcome_cards.html

CSS Structure

The CSS is separated by responsibility.

File               Responsibility

variables.css    Global theme variablesbase.css         General stylinglayout.css       Page layoutnavbar.css       Navigationbuttons.css      Buttonscards.css        Cardstimeline.css     Timeline componentsanimations.css   Animationsresponsive.css   Responsive behaviour

The interface follows a consistent NWU-inspired purple visual theme.

JavaScript Structure

app.js

Contains the main application functionality across the normal workflow.

It handles the existing Phase 1--Phase 4 behaviour and data flow.

returning.js

Contains the CSV-specific Returning Student functionality.

Keeping the CSV import logic separate prevents the returning workflowfrom unnecessarily changing the normal application logic.

Installation

Requirements

The project requires:

Python

Flask

A modern web browser

Internet access for externally hosted frontend resources

A Python virtual environment is recommended.

Create the Virtual Environment

From the project directory:

python -m venv venv

Activate it:

.env\Scripts\Activate.ps1

Install Dependencies

If the project contains requirements.txt:

pip install -r requirements.txt

Otherwise, Flask can be installed with:

pip install flask

Running the Application

From the project root:

python app.py

The development server should be available at an address similar to:

http://127.0.0.1:5000

Open that address in a browser.

Testing the New Student Workflow

Open the application.

Select New Student.

Enter student information.

Define the assessment plan.

Continue to Phase 2.

Verify student information.

Verify the assessment list.

Enter existing marks.

Leave future assessments blank.

Select Generate Model.

Verify the academic profile.

Continue to Phase 3.

Verify improvement scenarios.

Verify feasible scenarios.

Continue to Phase 4.

Verify the read-only summary.

Export the CSV.

Confirm that the downloaded filename is:

NWU_student_performance_summary.csv

Testing the Returning Student Workflow

Complete the New Student workflow.

Export the CSV.

Return to Phase 0.

Select Returning Student.

Select the saved CSV.

Select Import CSV.

Confirm automatic navigation to Phase 2.

Verify:

First Name

Surname

Student Number

Module

Assessment categories

Assessment quantities

Assessment weights

Existing marks

Non-existing marks

Select Generate Model.

Continue through Phase 3 and Phase 4.

Confirm that the restored student follows the normal workflow.

Important Development Rules

Do Not Change Existing Calculations

The application follows:

Calculate once, display many times.

Phase 4 should not recalculate academic results.

Phase 4 should display the existing results.

The CSV export should not perform academic calculations.

The Returning Student workflow should restore data rather than introducea second calculation system.

Preserve Data Structures

Be careful when changing the structure of:

studentModel
factorPerformance
remainingAssessmentSessions
feasibleScenarios

Multiple phases depend on these objects.

Preserve CSV Compatibility

The exported CSV format is also the input format for Returning Students.

Changes to the CSV structure must therefore be reflected in both:

CSV export

and:

CSV import

Development Debugging

Browser Developer Tools are useful when testing the application.

Console

Use the Console to identify JavaScript errors and inspect storedobjects.

For example:

JSON.parse(localStorage.getItem("studentModel"))

JSON.parse(localStorage.getItem("factorPerformance"))

JSON.parse(localStorage.getItem("remainingAssessmentSessions"))

To inspect all local-storage keys:

Object.keys(localStorage)

Network

The Network tab can be used to verify that files such as:

app.js
returning.js

are being requested successfully.

Testing Checklist

Phase 0

New Student button works

Returning Student button works

Phase 1

Student information is captured

Assessment categories can be created

Quantities are correct

Weights are correct

studentModel is saved

Phase 2

Student information loads

Assessments appear

Existing marks can be entered

Future assessments can remain blank

Academic profile generates correctly

Phase 3

Improvement scenarios appear

Feasible scenarios appear

Required marks are displayed correctly

Phase 4

Student information is displayed

Assessment framework is displayed

Existing marks are displayed

Missing marks display as —

Academic profile is displayed

Feasible scenarios are displayed

No new calculations are performed

CSV

Correct student information

Correct assessment names

Correct quantities

Correct weights

Existing marks included

Missing marks represented by -

Correct filename

CSV can be imported again

Returning Student

CSV file can be selected

CSV imports successfully

Student model is reconstructed

Phase 2 opens automatically

Student information is populated

Assessment information is populated

Existing marks are populated

Normal Phase 2 workflow continues

Technology Stack

Backend

Python

Flask

Jinja2

Frontend

HTML

CSS

JavaScript

Bootstrap 5

Font Awesome

Google Fonts

Data

Browser localStorage

CSV import/export

Development

Visual Studio Code

PowerShell

Git

GitHub

Browser Developer Tools

Project Status

The current implementation includes:

Phase 0 welcome page

New Student workflow

Returning Student workflow

CSV import

Phase 1 assessment setup

Phase 2 mark entry

Academic profile generation

Phase 3 improvement scenarios

Feasible scenario evaluation

Phase 4 read-only summary

Existing assessment marks

CSV export

CSV re-import

Consistent purple styling

Responsive interface

Application Architecture Summary

The overall design can be represented as:

                    ┌─────────────────────┐
                    │       Phase 0       │
                    │       Welcome       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 v                           v
        ┌─────────────────┐         ┌─────────────────┐
        │   New Student   │         │ Returning       │
        │                 │         │ Student         │
        └────────┬────────┘         └────────┬────────┘
                 │                           │
                 v                           │
        ┌─────────────────┐                  │
        │     Phase 1     │                  │
        │ Assessment Plan │                  │
        └────────┬────────┘                  │
                 │                           │
                 └─────────────┬─────────────┘
                               v
                    ┌─────────────────────┐
                    │       Phase 2       │
                    │  Academic Profile   │
                    └──────────┬──────────┘
                               │
                               v
                    ┌─────────────────────┐
                    │       Phase 3       │
                    │ Improvement Options │
                    └──────────┬──────────┘
                               │
                               v
                    ┌─────────────────────┐
                    │       Phase 4       │
                    │ Performance Summary │
                    └──────────┬──────────┘
                               │
                               v
                    ┌─────────────────────┐
                    │      Save CSV       │
                    └─────────────────────┘

Final Notes

The Student Performance Assistant is structured around the principle:

Capture → Calculate → Analyse → Summarise → Save → Restore

The most important architectural rule is that later phases should reusethe results and data produced by earlier phases rather than recreatingtheir calculations.

Phase 4 is therefore a presentation and export stage, while ReturningStudent is a restoration stage.

This keeps the application's academic logic consistent and makes thesystem easier to maintain and test.