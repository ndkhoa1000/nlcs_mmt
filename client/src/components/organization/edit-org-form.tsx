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
import { updateOrganizationSchema } from "@/validation/organization.validation";
import { editOrganizationMutationFn } from "@/lib/api";
import { useAuthContext } from "@/context/auth-provider";
import useOrgId from "@/hooks/use-org-id";
import { useEffect } from "react";
import { Permissions } from "@/constant";

export default function EditOrganizationForm() {
  const queryClient = useQueryClient();
  const {organization, hasPermission} = useAuthContext();
  const orgId = useOrgId();

  const canEditOrganization = hasPermission(Permissions.EDIT_ORGANIZATION);
  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof updateOrganizationSchema>) => 
      editOrganizationMutationFn(data, orgId),
  });

  const form = useForm<z.infer<typeof updateOrganizationSchema>>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name:"",
      address:"",
      phoneNumber: "",
      description:  "",
      mission: "",
      logo: "",
      email:"",
      website:"",
      socialMediaLink: [],
      establishedDate: new Date(),
    },
  });
  
  useEffect(() => {
    if (organization) {
      form.setValue("name", organization?.name || "");
      form.setValue("address", organization?.address || "");
      form.setValue("phoneNumber", organization?.phoneNumber || "");
      form.setValue("description", organization?.description || "");
      form.setValue("mission", organization?.mission || "");
      form.setValue("logo", organization?.logo || "");
      form.setValue("email", organization?.email || "");
      form.setValue("website", organization?.website || "");
      form.setValue("socialMediaLink", organization?.socialMediaLink || []);
      form.setValue("establishedDate", organization?.establishedDate ? new Date(organization.establishedDate) : new Date());
    }
  }, [form, organization]);

  const onSubmit = (values: z.infer<typeof updateOrganizationSchema>) => {
    console.log("Submit update Org: ", values);
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        console.log(data);
        toast({
          title: "Success",
          description: "Organization updated successfully",
          variant: "success",
        });
        queryClient.resetQueries({
          queryKey: ["userOrgs"]
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update organization",
          variant: "destructive"
        })
      },
    });
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 border-b">
          <h1
            className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
          >
            Edit Organization
          </h1>
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
                      <Input 
                        placeholder="Taco's Co." 
                        className="!h-[40px]" 
                        disabled={!canEditOrganization}
                        {...field} 
                      />
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
                        <Input 
                          placeholder="123 Main St, City, Country" 
                          className="!h-[40px]" 
                          disabled={!canEditOrganization}
                          {...field} 
                        />
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
                        <Input 
                          placeholder="+1 (123) 456-7890" 
                          className="!h-[40px]" 
                          disabled={!canEditOrganization}
                          {...field} 
                        />
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
                        <Input 
                          placeholder="https://yourdomain.com/logo.png" 
                          className="!h-[40px]" 
                          disabled={!canEditOrganization}
                          {...field} 
                        />
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
                        <Input 
                          placeholder="info@tacosco.com" 
                          className="!h-[40px]" 
                          disabled={!canEditOrganization}
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Website
                        <span className="text-xs font-extralight ml-2">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://tacosco.com" 
                          className="!h-[40px]" 
                          disabled={!canEditOrganization}
                          {...field} 
                        />
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
                        {(field.value || []).map((link, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={link || ""}
                              onChange={(e) => {
                                const newLinks = [...(field.value || [])];
                                newLinks[index] = e.target.value;
                                field.onChange(newLinks);
                              }}
                              className="!h-[40px]"
                              placeholder="https://twitter.com/youraccount"
                              disabled={!canEditOrganization}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newLinks = [...(field.value || [])];
                                newLinks.splice(index, 1);
                                field.onChange(newLinks);
                              }}
                              disabled={!canEditOrganization}
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
                          disabled={!canEditOrganization}
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
                          disabled={!canEditOrganization}
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
                        <Textarea 
                          rows={2} 
                          placeholder="Our mission is to..." 
                          disabled={!canEditOrganization}
                          {...field} 
                        />
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
                              disabled={!canEditOrganization}
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
                            disabled={!canEditOrganization}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          { canEditOrganization &&
            <Button
              className="shrink-0 flex place-self-end h-[40px] text-white font-semibold mt-4"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update Organization"}
            </Button>
          }
          </form>
        </Form>
      </div>
    </div>
  );
}
