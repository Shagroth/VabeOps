import type { CoverVariant } from "@/components/covers/CoverArt";

// No actual recording exists yet. `available` stays false everywhere —
// do not render a working play control for these until a real file exists.
export type RecordingConcept = {
  slug: string;
  title: string;
  cover: CoverVariant;
  description: string;
  available: false;
};

export const RECORDINGS: RecordingConcept[] = [
  {
    slug: "how-agent-loses-context",
    title: "Как агент теряет контекст: три сценария сбоя",
    cover: "recording",
    description:
      "Концепт записи: разбор трёх типичных способов, которыми агент незаметно теряет важный контекст задачи — и как это ловить до того, как это станет багом в проде.",
    available: false,
  },
  {
    slug: "reading-a-decision-trace",
    title: "Как читать Decision Trace чужой сдачи",
    cover: "terminal",
    description:
      "Концепт записи: на что смотреть в разборе решения коллеги — задача, отвергнутая альтернатива, проверка — чтобы фидбек был по существу, а не 'выглядит ок'.",
    available: false,
  },
];

export function getRecordingBySlug(slug: string) {
  return RECORDINGS.find((r) => r.slug === slug);
}
