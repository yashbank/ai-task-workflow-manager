import { KanbanBoard } from "@/components/kanban/kanban-board";

export default function KanbanPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Kanban</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Drag cards between columns to update status. Changes sync to your task list instantly.
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}
