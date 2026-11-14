import { requirePreviewEnv } from "../guard";
import { NO_COHORT_OVERVIEW } from "../fixtures";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { PreviewBanner } from "@/components/PreviewBanner";
import { WorkspaceOverview } from "@/components/workspace/dashboard";

export default function PreviewNoCohortPage() {
  requirePreviewEnv();

  return (
    <WorkspaceShell active="overview" email="preview-no-cohort@example.test" canAccessStudio={false}>
      <div className="mx-auto max-w-[1080px]">
        <PreviewBanner label="Обзор — аккаунт без когорты" />
      </div>
      <WorkspaceOverview data={NO_COHORT_OVERVIEW} />
    </WorkspaceShell>
  );
}
