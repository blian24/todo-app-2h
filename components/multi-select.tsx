"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

type Option = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: Option[]
  placeholder?: string
  onChange?: (values: string[]) => void
}

export function MultiSelect({ options, placeholder = "Select options", onChange }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Option[]>([])
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = React.useCallback(
    (option: Option) => {
      setSelected((prev) => {
        const isSelected = prev.find((item) => item.value === option.value)
        const newSelected = isSelected ? prev.filter((item) => item.value !== option.value) : [...prev, option]

        onChange?.(newSelected.map((item) => item.value))
        return newSelected
      })
      setInputValue("")
    },
    [onChange],
  )

  const handleRemove = React.useCallback(
    (option: Option) => {
      setSelected((prev) => {
        const newSelected = prev.filter((item) => item.value !== option.value)
        onChange?.(newSelected.map((item) => item.value))
        return newSelected
      })
    },
    [onChange],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = e.currentTarget.querySelector("input")
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input?.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev]
            newSelected.pop()
            onChange?.(newSelected.map((item) => item.value))
            return newSelected
          })
        }
      }
      // Prevent keyboard navigation from triggering unwanted scrolling
      if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault()
      }
    },
    [onChange],
  )

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm rounded-md flex items-center flex-wrap gap-1">
        {selected.map((option) => (
          <Badge key={option.value} variant="secondary" className="rounded-sm">
            {option.label}
            <button type="button" className="ml-1 rounded-full outline-none" onClick={() => handleRemove(option)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <CommandInput
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 h-auto"
        />
      </div>
      <div className="relative mt-1">
        {open && options.length > 0 && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="h-full overflow-auto max-h-[200px]">
                {options.map((option) => {
                  const isSelected = selected.find((item) => item.value === option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option)}
                      className={cn("flex items-center gap-2", isSelected && "bg-accent")}
                    >
                      <div className={cn("flex-1", isSelected && "font-medium")}>{option.label}</div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  )
}
