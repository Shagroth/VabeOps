import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSubmissionNotifyEmail, buildFeedbackNotifyEmail } from "./notify-templates.ts";

test("buildSubmissionNotifyEmail names the participant, week, and a direct review link", () => {
  const { subject, text } = buildSubmissionNotifyEmail({
    participantEmail: "person@example.com",
    weekNumber: 2,
    weekTitle: "Context engineering",
    moduleId: "mod-1",
    siteUrl: "https://vabeops.example.com",
  });
  assert.match(subject, /неделя 2/i);
  assert.match(text, /person@example\.com/);
  assert.match(text, /Context engineering/);
  assert.match(text, /https:\/\/vabeops\.example\.com\/admin\/modules\/mod-1/);
});

test("buildSubmissionNotifyEmail has no HTML markup", () => {
  const { text } = buildSubmissionNotifyEmail({
    participantEmail: "person@example.com",
    weekNumber: 1,
    weekTitle: "Agentic mindset",
    moduleId: "mod-1",
    siteUrl: "https://vabeops.example.com",
  });
  assert.doesNotMatch(text, /<[a-z]+>/i);
});

test("buildFeedbackNotifyEmail reflects ACCEPTED and includes the feedback text", () => {
  const { subject, text } = buildFeedbackNotifyEmail({
    weekNumber: 3,
    weekTitle: "MCP и плагины",
    moduleId: "mod-3",
    status: "ACCEPTED",
    feedbackText: "Отличная работа, можно двигаться дальше.",
    siteUrl: "https://vabeops.example.com",
  });
  assert.match(subject, /принята/);
  assert.match(text, /Отличная работа/);
  assert.match(text, /https:\/\/vabeops\.example\.com\/modules\/mod-3#submission/);
});

test("buildFeedbackNotifyEmail reflects NEEDS_REVISION", () => {
  const { subject, text } = buildFeedbackNotifyEmail({
    weekNumber: 1,
    weekTitle: "Agentic mindset",
    moduleId: "mod-1",
    status: "NEEDS_REVISION",
    feedbackText: "",
    siteUrl: "https://vabeops.example.com",
  });
  assert.match(subject, /доработку/);
  assert.match(text, /доработку/);
});

test("buildFeedbackNotifyEmail includes the score block when a rubric total is given", () => {
  const { text } = buildFeedbackNotifyEmail({
    weekNumber: 1,
    weekTitle: "Agentic mindset",
    moduleId: "mod-1",
    status: "ACCEPTED",
    feedbackText: "",
    siteUrl: "https://vabeops.example.com",
    score: { total: 18, max: 20, pass: 14 },
  });
  assert.match(text, /18 из 20/);
  assert.match(text, /проходной — 14/);
});

test("buildFeedbackNotifyEmail omits the score block when none is given", () => {
  const { text } = buildFeedbackNotifyEmail({
    weekNumber: 1,
    weekTitle: "Agentic mindset",
    moduleId: "mod-1",
    status: "ACCEPTED",
    feedbackText: "",
    siteUrl: "https://vabeops.example.com",
  });
  assert.doesNotMatch(text, /Балл:/);
});

test("buildFeedbackNotifyEmail omits the feedback block entirely when there is no comment", () => {
  const { text } = buildFeedbackNotifyEmail({
    weekNumber: 1,
    weekTitle: "Agentic mindset",
    moduleId: "mod-1",
    status: "ACCEPTED",
    feedbackText: "   ",
    siteUrl: "https://vabeops.example.com",
  });
  assert.doesNotMatch(text, /Комментарий автора/);
});
