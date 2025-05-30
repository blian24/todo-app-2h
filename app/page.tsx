import TaskList from "@/components/task-list"
import AddTaskForm from "@/components/add-task-form"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Task Manager</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TaskList />
            </div>
            <div className="lg:col-span-1">
              <AddTaskForm />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
