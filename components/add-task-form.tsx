"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { MultiSelect } from "./multi-select"

export default function AddTaskForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState("new")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File

    let attachmentUrl: string | null = null

    if (file && file.name) {
      const fileName = `${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(fileName, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
      } else {
        const { data } = supabase.storage
          .from("attachments")
          .getPublicUrl(fileName)
        attachmentUrl = data.publicUrl
      }
    }

    const { error: insertError } = await supabase.from("tasks").insert({
      title,
      description,
      status,
      attachment_urls: attachmentUrl ? [attachmentUrl] : [],
    })

    if (insertError) {
      console.error("Insert error:", insertError)
    } else {
      console.log("Task created successfully!")
      form.reset()
      setSelectedFile(null)
      setStatus("new")
    }

    setIsSubmitting(false)
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
            <Input id="title" name="title" placeholder="Task title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the task..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Attachment</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
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
