import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import { ProgramType } from "@/types/api.type";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProgramMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import useOrgId from "@/hooks/use-org-id";
import { updateProgramSchema } from "@/validation/program.validation";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";

export default function EditProgramForm({ 
  program, 
  onClose 
}: {
  program: ProgramType;
  onClose: () => void;
}) {
  const orgId = useOrgId();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuthContext();
  const canEditProgram = hasPermission(Permissions.EDIT_PROGRAM);
  const programId = program?._id as string;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof updateProgramSchema>) => 
      editProgramMutationFn(orgId, programId, data),
  });

  // Initialize form with program data directly in defaultValues
  const form = useForm<z.infer<typeof updateProgramSchema>>({
    resolver: zodResolver(updateProgramSchema),
    defaultValues: {
      name: program?.name || "",
      description: program?.description || "",
      startDate: program?.startDate ? new Date(program.startDate) : new Date(),
      endDate: program?.endDate ? new Date(program.endDate) : new Date(),
      sponsors: program?.sponsors || [],
      documents: program?.documents || [],
    },
  });

  // This useEffect ensures the form is updated if program data changes
  useEffect(() => {
    if (program) {
      form.reset({
        name: program.name || "",
        description: program.description || "",
        startDate: program.startDate ? new Date(program.startDate) : new Date(),
        endDate: program.endDate ? new Date(program.endDate) : new Date(),
        sponsors: program.sponsors || [],
        documents: program.documents || [],
      });
    }
  }, [program, form]);

  const onSubmit = (values: z.infer<typeof updateProgramSchema>) => {
    console.log("Submit update Program: ", values);
    if (isPending) return;
    
    mutate(values, {
      onSuccess: (data) => {
        console.log(data);
        toast({
          title: "Success",
          description: "Program updated successfully",
          variant: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["allPrograms", orgId]
        });
        queryClient.invalidateQueries({
          queryKey: ["program", programId]
        });
        if (onClose) onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update program",
          variant: "destructive"
        });
      },
    });
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Edit Program
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            Update the program details to refine event management
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Program title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Program title"
                        className="!h-[48px]"
                        disabled={!canEditProgram}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Program description
                      <span className="text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Describe the program's goals and activities"
                        disabled={!canEditProgram}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Start Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal !h-[40px]",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!canEditProgram}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={!canEditProgram}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      End Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal !h-[40px]",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!canEditProgram}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={!canEditProgram}
                          fromDate={form.getValues().startDate}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="sponsors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                    Sponsors
                    <span className="text-xs font-extralight ml-2">Optional</span>
                  </FormLabel>
                  <div className="space-y-2">
                    {(field.value || []).map((sponsor, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={sponsor || ""}
                          onChange={(e) => {
                            const newSponsors = [...(field.value || [])];
                            newSponsors[index] = e.target.value;
                            field.onChange(newSponsors);
                          }}
                          className="!h-[40px]"
                          placeholder="Sponsor name or organization"
                          disabled={!canEditProgram}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSponsors = [...(field.value || [])];
                            newSponsors.splice(index, 1);
                            field.onChange(newSponsors);
                          }}
                          disabled={!canEditProgram}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.onChange([...(field.value || []), ""]);
                      }}
                      className="w-full"
                      disabled={!canEditProgram}
                    >
                      Add Sponsor
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                    Documents
                    <span className="text-xs font-extralight ml-2">Optional</span>
                  </FormLabel>
                  <div className="space-y-2">
                    {(field.value || []).map((document, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={document || ""}
                          onChange={(e) => {
                            const newDocuments = [...(field.value || [])];
                            newDocuments[index] = e.target.value;
                            field.onChange(newDocuments);
                          }}
                          className="!h-[40px]"
                          placeholder="Document URL or reference"
                          disabled={!canEditProgram}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDocuments = [...(field.value || [])];
                            newDocuments.splice(index, 1);
                            field.onChange(newDocuments);
                          }}
                          disabled={!canEditProgram}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.onChange([...(field.value || []), ""]);
                      }}
                      className="w-full"
                      disabled={!canEditProgram}
                    >
                      Add Document
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {canEditProgram && (
              <Button
                className="shrink-0 flex place-self-end h-[40px] text-white font-semibold"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Program"}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
