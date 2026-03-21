import { mockApplication } from "../data/mockApp";
import ApplicationHeader from "../components/application/ApplicationHeader";
import OverviewPanel from "../components/application/OverviewPanel";
import TaskList from "../components/application/TaskList";
import AISummaries from "../components/application/AISummaries";

export default function ApplicationDetailPage() {
  const app = mockApplication;

  return (
    <div className="flex flex-col min-h-full">
      {/* App header */}
      <ApplicationHeader app={app} />

      {/* Overview snapshot */}
      <OverviewPanel app={app} />

      {/* Divider */}
      <div className="mx-6" style={{ borderTop: "1px solid #e9e9e9" }} />

      {/* Split view: Task List | AI Summaries */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
        <TaskList initialTasks={app.tasks} />
        <AISummaries summaries={app.aiSummaries} />
      </div>
    </div>
  );
}
