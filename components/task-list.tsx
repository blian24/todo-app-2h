"use client"

import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabaseClient'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, FileText, LinkIcon, Trash2 } from "lucide-react"

type Task = {
  id: string
  title: string
  description: string
  status: "new" | "in-progress" | "done" | "blocked"
  attachments?: string[]
  relatedTasks?: string[]
  completed?: boolean
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase.from('tasks').select('*')
      if (error) console.error(error)
      else setTasks(data || [])
    }

    fetchTasks()
  }, [])

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500 hover:bg-blue-600"
      case "in-progress":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "done":
        return "bg-green-500 hover:bg-green-600"
      case "blocked":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Tasks ({tasks.length})</h2>
      {tasks.map((task) => (
        <Card key={task.id} className="border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div>
                  <CardTitle className={`${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <Badge className={`${getStatusColor(task.status)} text-white`}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleExpand(task.id)}>
                  {expandedTasks[task.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </CardHeader>
          {expandedTasks[task.id] && (
            <>
              <CardContent className="pt-2">
                <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

                {task.attachments && task.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {task.attachments.map((attachment, index) => (
                        <Button key={index} variant="outline" size="sm" className="flex items-center gap-1">
                          <FileText size={14} />
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {task.relatedTasks && task.relatedTasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Related Tasks</h4>
                    <div className="flex flex-wrap gap-2">
                      {task.relatedTasks.map((relatedId) => {
                        const relatedTask = tasks.find((t) => t.id === relatedId)
                        return relatedTask ? (
                          <Button key={relatedId} variant="outline" size="sm" className="flex items-center gap-1">
                            <LinkIcon size={14} />
                            {relatedTask.title}
                          </Button>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">Created on May 28, 2025</CardFooter>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
