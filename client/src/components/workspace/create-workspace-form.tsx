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
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationMutationFn } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createOrganizationSchema } from "@/validation/organization.validation";

export default function CreateWorkspaceForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createOrganizationMutationFn,
  });


  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      socialMediaLink: [],
      establishedDate: new Date(),
    },
  });
  
  const onSubmit = (values: z.infer<typeof createOrganizationSchema>) => {
    console.log("Submit create Org: ", values);
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ["userOrganizations"]
        });
        const organization = data.organization;
        onClose(); //close the dialog.
        navigate(`/organization/${organization._id}`)
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
      },
    });
  };

  return (
    <main className="w-full flex flex-row min-h-[550px] h-auto max-w-full">
      <div className="h-full px-4 sm:px-6 md:px-8 py-6 flex-1 overflow-y-auto">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1 text-center sm:text-left">
            Let's create an Organization
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-tight">
            Boost your productivity in management by making it easier for everyone to access events in one location.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Required Fields Section */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Organization name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Taco's Co." className="!h-[40px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, Country" className="!h-[40px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Phone Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (123) 456-7890" className="!h-[40px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Logo URL
                        <span className="text-xs font-extralight ml-2">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourdomain.com/logo.png" className="!h-[40px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Email
                        <span className="text-xs font-extralight ml-2">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="info@tacosco.com" className="!h-[40px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField  
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Website
                        <span className="text-xs font-extralight ml-2">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://tacosco.com" className="!h-[40px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMediaLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Social Media Links
                        <span className="text-xs font-extralight ml-2">Optional</span>
                      </FormLabel>
                      <div className="space-y-2">
                        {field.value?.map((link, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={link}
                              onChange={(e) => {
                                const newLinks = [...field.value || []];
                                newLinks[index] = e.target.value;
                                field.onChange(newLinks);
                              }}
                              className="!h-[40px]"
                              placeholder="https://twitter.com/youraccount"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newLinks = [...field.value || []];
                                newLinks.splice(index, 1);
                                field.onChange(newLinks);
                              }}
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
                            field.onChange([...(field.value || [])]);
                          }}
                          className="w-full"
                        >
                          Add Social Media Link
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Description
                        <span className="text-xs font-extralight ml-2">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="Our team organizes marketing projects and tasks here." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Mission
                        <span className="text-xs font-extralight ml-2">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea rows={2} placeholder="Our mission is to..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="establishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Established Date
                        <span className="text-xs font-extralight ml-2">Optional</span>
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
              
            <Button
              className="w-full h-[40px] text-white font-semibold mt-4"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Organization"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
