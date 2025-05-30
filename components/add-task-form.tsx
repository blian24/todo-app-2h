"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "./multi-select"

export default function AddTaskForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()
      setSelectedFile(null)
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
        <CardDescription>Create a new task with details</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="new">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the task..." className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Attachment</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {selectedFile && <p className="text-xs text-muted-foreground">Selected: {selectedFile.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="related">Related Tasks</Label>
            <MultiSelect
              options={[
                { value: "1", label: "Create project wireframes" },
                { value: "2", label: "Implement authentication flow" },
                { value: "3", label: "Set up database schema" },
                { value: "4", label: "API integration" },
              ]}
              placeholder="Select related tasks"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
