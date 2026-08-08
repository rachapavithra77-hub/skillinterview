Build a COMPLETE full-stack application called:

AI Interview Agent

I need BOTH:

A complete frontend

A complete working backend

Do NOT create only a frontend.

Do NOT use mock/demo mode as the primary implementation.

Do NOT leave TODOs or placeholder functionality.

The final application must run end-to-end.

==================================================

CORE PRODUCT

==================================================

This is an AI-powered interview agent.

The application must conduct an interactive interview with a candidate.

Requirements:

Ask a minimum of 8 questions.

Questions must cover at least 4 different curriculum days.

Generate follow-up questions based on previous candidate responses.

Maintain conversation context throughout the interview.

Produce structured feedback at the end.

Expose the required HTTP API endpoints.

The application must be fully usable from the browser.

No voice interaction is required.

No user authentication is required.

No persistent user accounts are required.

Long-term conversation history is not required.

The curriculum and candidate data are synthetic hackathon data.

==================================================

TECH STACK

==================================================

FRONTEND:

React

Vite

React Router

Modern component architecture

Responsive CSS

Lucide icons

No generic template styling

BACKEND:

Node.js

Express

TypeScript

REST API

OpenAI API for AI interview reasoning

Zod for request validation

CORS

dotenv

Proper error handling

Use environment variables.

Never expose the OpenAI API key to the frontend.

==================================================

PROJECT STRUCTURE

==================================================

Create a clean monorepo:

/

├── frontend/

│ ├── src/

│ │ ├── components/

│ │ ├── pages/

│ │ ├── services/

│ │ ├── hooks/

│ │ ├── utils/

│ │ ├── data/

│ │ ├── App.jsx

│ │ └── main.jsx

│ ├── package.json

│ └── ...

│

├── server/

│ ├── src/

│ │ ├── controllers/

│ │ ├── routes/

│ │ ├── services/

│ │ ├── middleware/

│ │ ├── config/

│ │ ├── utils/

│ │ ├── types/

│ │ └── index.ts

│ ├── package.json

│ ├── tsconfig.json

│ └── .env.example

│

└── README.md

Keep frontend and backend clearly separated.

==================================================

BACKEND

==================================================

Build a real Express backend.

Server port:

5000

Environment variable:

PORT=5000

Environment variable:

OPENAI_API_KEY=

Create:

GET /health

Response:

{

"status": "active"

}

==================================================

INTERVIEW API

==================================================

Create these endpoints:

POST /api/agent/init

POST /api/interview/start

POST /api/interview/message

GET /api/interview/feedback/:sessionId

GET /api/interview/session/:sessionId

POST /api/interview/end

The evaluator may call:

POST /api/agent/init

exactly once.

Therefore implement this endpoint correctly.

It must initialize the autonomous agent/session state and return a successful JSON response.

Do not require any additional prompt from the evaluator.

==================================================

INTERVIEW START

==================================================

POST:

/api/interview/start

Request:

{

"userId": "user-1",

"day": 1

}

Response must contain:

{

"sessionId": "...",

"question": {

"id": "...",

"text": "...",

"day": 1


}

}

Create a unique session ID.

==================================================

INTERVIEW MESSAGE

==================================================

POST:

/api/interview/message

Request:

{

"sessionId": "...",

"content": "candidate answer"

}

The backend must:

Load the interview session.

Preserve previous messages.

Analyze the candidate's latest answer.

Consider previous answers.

Decide whether to ask a follow-up question or move to the next curriculum question.

Generate the next question.

Maintain the interview context.

Return the AI interviewer response.

Response:

{

"message": {

"role": "assistant",

"content": "...",

"questionId": "..."


},

"progress": {

"current": 3,

"total": 8


},

"completed": false

}

At least 8 questions must be completed.

==================================================

CURRICULUM REQUIREMENT

==================================================

Create a structured synthetic curriculum containing at least 4 curriculum days.

Example:

Day 1:

Introduction

Background

Fundamentals

Day 2:

Technical concepts

Problem solving

Day 3:

Projects

Debugging

System thinking

Day 4:

Behavioral

Teamwork

Leadership

Do not simply ask random questions.

Track which curriculum day each question belongs to.

Ensure the interview covers at least 4 different curriculum days.

==================================================

FOLLOW-UP QUESTIONS

==================================================

This is extremely important.

The AI must generate follow-up questions based on the candidate's previous answer.

Example:

AI:

"Tell me about a difficult project."

Candidate:

"I built a recommendation system."

AI follow-up:

"What was the biggest technical challenge you faced while building that recommendation system?"

The follow-up must reference the candidate's previous response.

Do NOT use completely unrelated generic questions.

==================================================

CONVERSATION CONTEXT

==================================================

Maintain:

sessionId

candidate ID

curriculum day

current question

question history

candidate answers

AI responses

timestamps

scores

feedback

The AI service must receive relevant conversation context when generating follow-up questions.

==================================================

AI SERVICE

==================================================

Create a dedicated AI service.

Example:

server/src/services/ai.service.ts

Responsibilities:

Generate interview questions

Generate follow-up questions

Analyze candidate answers

Generate final feedback

Score candidate responses

Use OpenAI through the backend.

Create a clear system prompt for the interviewer.

The interviewer should behave like a professional technical interviewer.

It should:

ask one question at a time

avoid repeating questions

use previous answers

ask useful follow-ups

remain professional

maintain context

cover the required curriculum

finish after at least 8 questions

If OPENAI_API_KEY is unavailable, return a clear backend configuration error instead of crashing the server.

==================================================

FEEDBACK

==================================================

GET:

/api/interview/feedback/:sessionId

Return structured feedback:

{

"overallScore": 82,

"technicalScore": 85,

"communicationScore": 80,

"problemSolvingScore": 84,

"confidenceScore": 78,

"strengths": [],

"areasToImprove": [],

"summary": "...",

"questionFeedback": []

}

Feedback must be based on the actual conversation.

==================================================

FRONTEND

==================================================

Create a complete professional frontend.

Do NOT make the frontend look like a basic Vite application.

==================================================

UNIQUE DESIGN

==================================================

Create a unique visual identity for the application.

Theme:

"AI Interview Control Room"

Use:

deep navy background

subtle blue/purple gradients

white cards

glassmorphism panels

soft borders

subtle glow effects

modern typography

clean spacing

professional icons

smooth transitions

Do NOT copy a generic dashboard template.

Create custom CSS.

Use subtle animated background elements.

Use a distinctive interview progress indicator.

Make the interview screen feel like an actual AI interview environment.

Responsive on:

desktop

tablet

mobile

==================================================

LANDING PAGE

==================================================

Route:

/

Create:

Header:

AI Interview Agent logo

Navigation:

Home

How It Works

Features

CTA:

Start Interview

Hero:

"Practice smarter.

Interview with confidence."

Supporting text explaining the AI interviewer.

Create a visually impressive AI interview illustration using CSS/components rather than requiring external images.

Add:

AI interviewer visualization

floating conversation cards

subtle animated elements

Feature cards:

AI-Powered Interviews

Context-Aware Follow-ups

Real-Time Feedback

Structured Performance Analysis

How It Works:

01 Choose

02 Interview

03 Improve

CTA section:

"Ready for your next interview?"

Button:

Start Interview

==================================================

INTERVIEW SETUP

==================================================

Route:

/setup

Create a premium setup page.

Fields:

Candidate ID

Default:

user-1

Curriculum Day

Allow:

Day 1

Day 2

Day 3

Day 4

Interview Type:

Technical

Behavioral

Mixed

Difficulty:

Beginner

Intermediate

Advanced

Show an interview preview card.

Show:

Minimum 8 questions

Context-aware follow-ups

AI feedback

Button:

"Begin AI Interview"

==================================================

INTERVIEW ROOM

==================================================

Route:

/interview

This is the most important screen.

Create a professional split-screen interview interface.

LEFT:

AI interviewer panel.

Show:

AI Interviewer

● Online

Animated AI status indicator.

Conversation history.

AI messages.

Candidate messages.

RIGHT:

Current question panel.

Show:

CURRICULUM DAY 2

Question 4 / 8

Progress bar.

Timer.

Question text.

Answer textarea.

Buttons:

Submit Answer

Clear

After submitting:

Show:

"AI is analyzing your response..."

Then display next AI response.

Follow-up questions must appear naturally.

==================================================

INTERVIEW TOP BAR

==================================================

Show:

AI Interview Agent

Day 2

Question 4 / 8

Progress:

50%

Timer:

12:34

Button:

End Interview

==================================================

INTERVIEW COMPLETION

==================================================

After at least 8 questions:

Route:

/complete

Show:

"Interview Complete"

Large success visualization.

Show:

Overall Score

Example:

82 / 100

Category cards:

Technical

Communication

Problem Solving

Confidence

Show strengths.

Show improvement areas.

Show AI-generated summary.

==================================================

RESULTS

==================================================

Route:

/results/:sessionId

Show detailed performance.

Include:

Overall Score

Category scores

Question-by-question feedback

Candidate answers

AI analysis

Strengths

Areas to improve

Recommended next steps

Create a polished score visualization.

Use animated progress rings/bars.

==================================================

DASHBOARD

==================================================

Route:

/dashboard

Show:

Welcome back.

Stats:

Interviews

Average Score

Best Score

Questions Answered

Recent Interview list.

Buttons:

Start New Interview

View Results

==================================================

FRONTEND API SERVICE

==================================================

Create:

frontend/src/services/api.js

or TypeScript equivalent.

Use:

VITE_API_URL

Default:

http://localhost:5000/api

Implement:

initAgent()

startInterview()

sendAnswer()

getSession()

getFeedback()

endInterview()

Centralize API calls.

Do not put fetch logic directly in UI components.

==================================================

ERROR HANDLING

==================================================

If backend unavailable:

Show:

"Interview server unavailable."

Buttons:

Retry

Check Server

Do not crash the application.

Display friendly errors.

Show loading states for all API calls.

==================================================

STATE

==================================================

Maintain:

userId

sessionId

curriculumDay

interviewType

difficulty

messages

questions

answers

currentQuestion

progress

timer

feedback

loading

error

Use React Context or clean hooks if necessary.

==================================================

NO AUTHENTICATION

==================================================

Do not build login/signup.

No persistent accounts required.

Use temporary session state.

==================================================

NO VOICE

==================================================

Do not implement voice.

Text interview is sufficient.

==================================================

DATA

==================================================

Create synthetic curriculum data.

Minimum:

4 curriculum days

Minimum:

8 questions

Include enough questions for follow-ups.

==================================================

AUTONOMOUS AGENT

==================================================

Also implement the autonomous agent requirement.

POST:

/api/agent/init

The agent must initialize without needing additional user instructions.

GET:

/api/agent/feed

Return agent-generated posts/updates.

The autonomous agent should generate useful interview-related insights/posts after initialization.

Do not require the evaluator to provide another prompt.

Any generated feed content must come from the autonomous agent after initialization.

==================================================

SECURITY

==================================================

Never expose:

OPENAI_API_KEY

in frontend.

Use:

server/.env

Create:

server/.env.example

with:

PORT=5000

OPENAI_API_KEY=

CLIENT_URL=http://localhost:5173

==================================================

CORS

==================================================

Configure CORS for the frontend development URL.

Allow:

http://localhost:5173

Also allow the deployed frontend origin through an environment variable.

Do not use wildcard CORS in production.

==================================================

DEPLOYMENT

==================================================

Make the application deployment-ready.

Frontend:

Vercel compatible.

Backend:

Render/Railway compatible.

Use environment variables.

Do not hardcode production secrets.

==================================================

README

==================================================

Create a complete README explaining:

Project overview

Features

Architecture

Frontend setup

Backend setup

Environment variables

How to run locally

API endpoints

Deployment

AI usage

==================================================

QUALITY BAR

==================================================

Before finishing:

No TypeScript errors

No broken imports

No missing dependencies

No console errors

No blank pages

All routes work

All buttons work

API requests work

CORS works

Loading states work

Error states work

Responsive design works

Backend starts successfully

Frontend starts successfully

Interview can complete at least 8 questions

Follow-up questions use previous answers

Four curriculum days are covered

Structured feedback is generated

/api/agent/init works

/api/agent/feed works

README is complete

Do not stop at the landing page.

Do not ask me what to build next.

Build the entire full-stack application now.

After implementation, run/build/test the project and fix any errors you encounter before considering the project complete.

Show less
Today at 12:26 PM
Built full interview agent app

No tasks tracked yet.
Details
Preview

Built and verified end-to-end.




Backend (TanStack server routes, Zod-validated, CORS + error handling, AI key server-only):
GET /health · POST /api/agent/init · GET /api/agent/feed · POST /api/interview/start · POST /api/interview/message · GET /api/interview/session/:id · GET /api/interview/feedback/:id · POST /api/interview/end




Verified with a real run: 8 curriculum questions across days 1–4, AI-generated follow-ups that quote the candidate's own words, completion at slot 8, and structured feedback (daysCovered: [1,2,3,4], scores, per-question analysis).




Frontend: /, /setup, /interview, /complete, /results/:sessionId, /dashboard in an "AI Interview Control Room" theme (deep navy, aurora background, glass panels, animated waveform interviewer, live progress + timer), with centralized src/services/api.ts, loading/error states and a "Check Server" fallback. No console errors.




One deviation worth flagging: this workspace runs a single TanStack Start app, so the backend is implemented as real HTTP server routes in the same project rather than a separate Express server/ process — all endpoints, request bodies and response shapes match your spec exactly, and the README documents the mapping.
