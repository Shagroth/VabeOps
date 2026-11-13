-- Rubric scores for a review (nullable, additive — see schema.prisma
-- SubmissionFeedback.scores for the shape and HOMEWORK_SCORING for the
-- rubric). Safe to apply without data loss.
ALTER TABLE "SubmissionFeedback" ADD COLUMN "scores" JSONB;
