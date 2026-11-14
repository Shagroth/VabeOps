import { requirePreviewEnv } from "../guard";
import { ENROLLED_OVERVIEW } from "../fixtures";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { PreviewBanner } from "@/components/PreviewBanner";
import { WorkspaceOverview } from "@/components/workspace/dashboard";

export default function PreviewDashboardPage() {
  requirePreviewEnv();

  return (
    <WorkspaceShell active="overview" email="preview@example.test" canAccessStudio={false} breadcrumb="Demo Pilot">
      <div className="mx-auto max-w-[1080px]">
        <PreviewBanner label="Обзор — зачисленный участник" />
      </div>
      <WorkspaceOverview data={ENROLLED_OVERVIEW} />
    </WorkspaceShell>
  );
}
