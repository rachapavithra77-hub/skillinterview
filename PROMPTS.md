# PROMPTS.md

## Project

**AI Interview Agent / SkillInterview**

## Purpose

A curriculum-driven AI interview practice application that conducts an
interview across four curriculum days, asks at least 8 questions,
supports context-aware follow-ups, provides feedback/scoring, and shows
a structured final performance analysis.

> This is a consolidated readable record of the build
> prompts/instructions used. It is not a verbatim export of every AI
> chat message; wording has been normalized from the build conversation.

------------------------------------------------------------------------

## 1. Initial build prompt

Build a complete full-stack application called **AI Interview Agent**.

Requirements:

-   Create a complete responsive frontend, not a single page.
-   Create the required backend/API flow.
-   Provide a polished and unique AI-themed UI with modern dark/blue
    styling, glassmorphism-style cards, gradients, progress indicators,
    responsive layouts, and consistent navigation.
-   Include:
    -   Landing/Home page
    -   How It Works section/page
    -   Features section/page
    -   Dashboard
    -   Interview Setup page
    -   Live Interview page
    -   Interview Complete / Results page
-   Add navigation between pages and make all primary buttons
    functional.

### Interview requirements

The interview must be curriculum-driven and cover four curriculum days:

1.  **Day 1 --- Introduction & Fundamentals**
2.  **Day 2 --- Technical Concepts & Problem Solving**
3.  **Day 3 --- Projects, Debugging & System Thinking**
4.  **Day 4 --- Behavioral, Teamwork & Leadership**

The interview should:

-   Ask a minimum of 8 questions.
-   Ask one question at a time.
-   Maintain conversation context.
-   Generate context-aware follow-up questions based on the candidate's
    previous answer.
-   Show interview progress.
-   Allow the candidate to type and submit answers.
-   Provide AI-style feedback and scoring.
-   Produce a final structured performance report.
-   Include technical understanding, communication, problem solving, and
    confidence scores.
-   Show strengths, areas to improve, and an AI summary at completion.

------------------------------------------------------------------------

## 2. Frontend and UX instructions

Create a professional interview-coach experience rather than a generic
quiz.

Use a distinctive dark/blue AI visual language with:

-   Responsive desktop and mobile layouts
-   Glassmorphism cards
-   Soft gradients
-   Clear typography
-   Progress indicators
-   Interview status indicators
-   Curriculum/day labels
-   Clear primary and secondary actions
-   Consistent navigation

The home page should communicate the product clearly and provide actions
to start an interview and view the dashboard.

The setup page should allow the candidate to configure:

-   Candidate/User ID
-   Curriculum day
-   Interview type: Technical / Behavioral / Mixed
-   Difficulty: Beginner / Intermediate / Advanced

The interview page should show:

-   Current curriculum day
-   Current question number and total questions
-   Progress
-   AI interviewer state
-   Conversation history
-   Answer input
-   Submit and clear controls

The completion page should show:

-   Overall score
-   Category scores
-   Strengths
-   Areas to improve
-   AI summary
-   Option to view detailed results or dashboard

------------------------------------------------------------------------

## 3. Interview logic / backend instructions

Implement the interview flow so that the frontend communicates with the
backend/API where required.

Support:

-   Interview session creation
-   Question progression
-   Answer submission
-   Follow-up generation/selection
-   Score calculation
-   Final results
-   Health/status endpoint

The interview should not behave like a static list of unrelated
questions. Follow-ups should reference information from the candidate's
previous answer and the interview should maintain session context.

------------------------------------------------------------------------

## 4. Curriculum instructions

Use these four curriculum areas consistently throughout the application:

### Day 1 --- Introduction & Fundamentals

Focus on background, motivation, fundamentals, and introductory
software-engineering topics.

### Day 2 --- Technical Concepts & Problem Solving

Focus on technical understanding, concepts, reasoning, and problem
solving.

### Day 3 --- Projects, Debugging & System Thinking

Focus on projects, debugging, technical challenges, system thinking, and
practical engineering reasoning.

### Day 4 --- Behavioral, Teamwork & Leadership

Focus on behavioral questions, teamwork, collaboration, communication,
ownership, and leadership.

The final report must account for performance across the curriculum.

------------------------------------------------------------------------

## 5. AI feedback and scoring instructions

Provide structured evaluation after answers and at the end of the
interview.

The final report should include:

-   Overall score out of 100
-   Technical score
-   Communication score
-   Problem-solving score
-   Confidence score
-   Strengths
-   Areas to improve
-   A concise AI-generated summary

Feedback should be tied to the candidate's actual answers rather than
being generic.

------------------------------------------------------------------------

## 6. Functional testing / fixes

During development, test the complete flow:

Home → Interview Setup → Interview → Answer submission → Follow-up
questions → Completion → Results/Dashboard.

Fix issues that prevent:

-   API requests from working
-   Interview sessions from starting
-   Answers from being submitted
-   Follow-up questions from appearing
-   Results from being displayed
-   Pages/routes from loading
-   Mobile/responsive layouts from working

Keep the application functional end-to-end.

------------------------------------------------------------------------

## 7. Deployment / repository instructions

Prepare the project so it can be deployed as a working web application.

The final project must have:

-   Full source code in the GitHub repository
-   A working deployed URL
-   A root-level `PROMPTS.md` containing the AI build prompt log

Do not remove working application features while adding documentation.

------------------------------------------------------------------------

## 8. Documentation-only follow-up

Create this file at the repository root:

`PROMPTS.md`

Do not change the existing application UI, routes, styling, interview
functionality, backend behavior, or deployment configuration merely to
add this documentation file.
