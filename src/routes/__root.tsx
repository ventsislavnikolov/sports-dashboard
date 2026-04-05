import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar placeholder — replaced in Task 12 */}
      <aside className="w-[260px] min-w-[260px] bg-bg-surface border-r border-bg-hover overflow-y-auto">
        <div className="p-4 text-text-muted text-xs">Sidebar</div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
