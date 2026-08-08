export type CurriculumDay = {
  day: number;
  title: string;
  topics: string[];
  questions: { id: string; text: string; topic: string }[];
};

export const CURRICULUM: CurriculumDay[] = [
  {
    day: 1,
    title: "Introduction & Fundamentals",
    topics: ["Introduction", "Background", "Fundamentals"],
    questions: [
      {
        id: "d1-q1",
        topic: "Introduction",
        text: "To start, walk me through your background and what drew you into software engineering.",
      },
      {
        id: "d1-q2",
        topic: "Fundamentals",
        text: "Explain the difference between a value type and a reference type, and describe a bug you've seen caused by that distinction.",
      },
      {
        id: "d1-q3",
        topic: "Background",
        text: "Which part of the stack do you feel strongest in today, and how did you build that strength?",
      },
    ],
  },
  {
    day: 2,
    title: "Technical Concepts & Problem Solving",
    topics: ["Technical concepts", "Problem solving", "Data structures"],
    questions: [
      {
        id: "d2-q1",
        topic: "Technical concepts",
        text: "How would you design an API that must stay responsive while doing slow downstream work? Describe your approach.",
      },
      {
        id: "d2-q2",
        topic: "Problem solving",
        text: "Given a stream of events with duplicates, how would you deduplicate efficiently at scale? Talk through complexity trade-offs.",
      },
      {
        id: "d2-q3",
        topic: "Data structures",
        text: "When would you choose a hash map over a sorted structure, and where does that choice break down?",
      },
    ],
  },
  {
    day: 3,
    title: "Projects, Debugging & System Thinking",
    topics: ["Projects", "Debugging", "System thinking"],
    questions: [
      {
        id: "d3-q1",
        topic: "Projects",
        text: "Tell me about the most difficult project you have worked on and what made it hard.",
      },
      {
        id: "d3-q2",
        topic: "Debugging",
        text: "Describe a production bug you diagnosed. How did you narrow it down and what did you change to prevent recurrence?",
      },
      {
        id: "d3-q3",
        topic: "System thinking",
        text: "If your service suddenly saw 10x traffic tomorrow, what would break first and what would you do about it?",
      },
    ],
  },
  {
    day: 4,
    title: "Behavioral, Teamwork & Leadership",
    topics: ["Behavioral", "Teamwork", "Leadership"],
    questions: [
      {
        id: "d4-q1",
        topic: "Teamwork",
        text: "Tell me about a time you disagreed with a teammate on a technical decision. How did it resolve?",
      },
      {
        id: "d4-q2",
        topic: "Leadership",
        text: "Describe a moment where you took ownership beyond your assigned scope. What was the outcome?",
      },
      {
        id: "d4-q3",
        topic: "Behavioral",
        text: "How do you handle feedback that you initially disagree with? Give a concrete example.",
      },
    ],
  },
];

export const DAY_TITLES = Object.fromEntries(CURRICULUM.map((d) => [d.day, d.title]));

/** Build an 8-slot interview plan covering all 4 curriculum days, starting at `startDay`. */
export function buildPlan(startDay: number, interviewType: string) {
  const order: number[] = [];
  const days = CURRICULUM.map((d) => d.day);
  const startIdx = Math.max(0, days.indexOf(startDay));
  const rotated = [...days.slice(startIdx), ...days.slice(0, startIdx)];

  // Two questions per day => 8 slots, all four days covered.
  for (const day of rotated) order.push(day, day);

  const used = new Set<string>();
  return order.map((day, i) => {
    const dayDef = CURRICULUM.find((d) => d.day === day)!;
    const pool = dayDef.questions.filter((q) => !used.has(q.id));
    const preferBehavioral = interviewType === "behavioral";
    const preferTechnical = interviewType === "technical";
    const picked =
      pool.find((q) => {
        if (preferBehavioral) return /team|leader|behav|intro|backgro/i.test(q.topic);
        if (preferTechnical) return !/behav|team|leader/i.test(q.topic);
        return true;
      }) ?? pool[0]!;
    used.add(picked.id);
    return {
      slot: i + 1,
      day,
      dayTitle: dayDef.title,
      questionId: picked.id,
      topic: picked.topic,
      text: picked.text,
    };
  });
}

export const TOTAL_QUESTIONS = 8;
