-- Link a cohort week to a course module from src/content (nullable, additive).
ALTER TABLE "Module" ADD COLUMN "courseModuleNumber" INTEGER;
