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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProgramMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import useOrgId from "@/hooks/use-org-id";
import { createProgramSchema } from "@/validation/program.validation";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import { useNavigate } from "react-router-dom";

export default function CreateProgramForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const orgId = useOrgId();
  const queryClient = useQueryClient();

  const { hasPermission } = useAuthContext();
  const canCreateProgram = hasPermission(Permissions.CREATE_PROGRAM);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof createProgramSchema>) => 
      createProgramMutationFn(orgId, data),
  });

  const form = useForm<z.infer<typeof createProgramSchema>>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      sponsors: [],
      documents: [],
    },
  });

  const onSubmit = (values: z.infer<typeof createProgramSchema>) => {
    console.log("Submit create Program: ", values);
    if (isPending) return;
    
    mutate(values, {
      onSuccess: (data) => {
        console.log(data);
        toast({
          title: "Success",
          description: "Program created successfully",
          variant: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["allPrograms", orgId]
        });
        navigate(`/organization/${orgId}/program/${data.program._id}`);
        setTimeout(() => onClose(), 500);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create program",
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
            Create Program
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            Organize and manage tasks, resources, and team collaboration
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
                        placeholder="Annual Fundraising Campaign"
                        className="!h-[48px]"
                        disabled={!canCreateProgram}
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
                        disabled={!canCreateProgram}
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
                            disabled={!canCreateProgram}
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
                          disabled={!canCreateProgram}
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
                            disabled={!canCreateProgram}
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
                          disabled={!canCreateProgram}
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
                          disabled={!canCreateProgram}
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
                          disabled={!canCreateProgram}
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
                      disabled={!canCreateProgram}
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
                          disabled={!canCreateProgram}
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
                          disabled={!canCreateProgram}
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
                      disabled={!canCreateProgram}
                    >
                      Add Document
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {canCreateProgram && (
              <Button
                className="shrink-0 flex place-self-end h-[40px] text-white font-semibold"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Program"}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
