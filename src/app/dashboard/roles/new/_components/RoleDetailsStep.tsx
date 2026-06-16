import { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  AddRoleFormValues,
  CATEGORY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
} from "./constants"

interface RoleDetailsStepProps {
  form: UseFormReturn<AddRoleFormValues>
}

export function RoleDetailsStep({ form }: RoleDetailsStepProps) {
  const jdType = form.watch("jdType")
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 mb-2 border-b">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize px-2 py-0.5">
          {jdType === "company" ? "Company Specific" : "Role Specific"}
        </Badge>
        <span className="text-xs text-muted-foreground">Type selected</span>
      </div>
      <div>
        <h2 className="text-base font-semibold">Role Details</h2>
        <p className="text-sm text-muted-foreground">
          Core details about the role and company.
        </p>
      </div>

      {/* Row 1: Role Name (and Company Name if Company specific) */}
      <div className={cn("grid gap-4", jdType === "company" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
        <FormField
          control={form.control}
          name="jobName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Backend Engineer" className="h-12 px-4 text-base" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {jdType === "company" && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Amazon" className="h-12 px-4 text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Row 2: Category | Experience Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger size="custom" className="w-full h-12 px-4 text-base font-normal text-left">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience Level Dropdown */}
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger size="custom" className="w-full h-12 px-4 text-base font-normal text-left">
                    <SelectValue placeholder="Select Experience Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Row 3: Employment Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger size="custom" className="w-full h-12 px-4 text-base font-normal text-left">
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EMPLOYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
