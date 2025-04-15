import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, ChevronsUpDown, Loader, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { getAvatarFallbackText, transformOptions } from "@/lib/helper";
import useOrgId from "@/hooks/use-org-id";
import { EventPriorityEnum, EventStatusEnum, eventCategoriesEnums, eventCategoryEnumType } from "@/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getEventByIdQueryFn, 
  getAllMemberInOrganizationQueryFn, 
  getProgramsInOrganizationQueryFn,
  updateEventMutationFn
} from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/helper";
import { createEventSchema as updateEventSchema } from "@/validation/event.validation";
import { Command, CommandEmpty, CommandGroup, CommandInput } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

// Define the steps of the form
const FORM_STEPS = {
  BASIC_INFO: 0,
  ADVANCED_DETAILS: 1,
};

export default function EditEventForm(props: {
  eventId: string;
  onClose: () => void;
}) {
  const { eventId, onClose } = props;
  const orgId = useOrgId();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuthContext();
  const canEditEvent = hasPermission(Permissions.EDIT_EVENT);
  
  // Track current form step
  const [currentStep, setCurrentStep] = useState(FORM_STEPS.BASIC_INFO);
  const [isLoading, setIsLoading] = useState(true);

  // Get event data
  const { data: eventData, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId, orgId],
    queryFn: () => getEventByIdQueryFn(orgId, eventId),
    enabled: !!eventId && !!orgId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof updateEventSchema>) => 
      updateEventMutationFn(orgId, eventId, data),
  });

  // Get programs from API
  const { data: programsData, isLoading: isProgramsLoading } = useQuery({
    queryKey: ["allPrograms", orgId],
    queryFn: () => getProgramsInOrganizationQueryFn({ orgId, pageSize: 100 }),
    enabled: !!orgId,
  });
  
  // Program options for select dropdown
  const programOptions = programsData?.programs?.map(program => ({
    label: program.name,
    value: program._id,
  })) || [];

  // Get members from API
  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ["members", orgId],
    queryFn: () => getAllMemberInOrganizationQueryFn(orgId),
    enabled: !!orgId,
  });

  // Initialize form
  const form = useForm<z.infer<typeof updateEventSchema>>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: "",
      description: "",
      program: "",
      category: [],
      location: "",
      status: EventStatusEnum.PENDING,
      priority: EventPriorityEnum.MEDIUM,
      assignedTo: [],
      cohost: [],
      requiredVolunteer: 0,
      registrationDeadline: undefined,
      startTime: undefined,
      endTime: undefined,
      documents: [],
      needTraining: false,
    },
  });

  // Update form values when event data is available
  useEffect(() => {
    if (eventData?.event) {
      const event = eventData.event;
      
      setIsLoading(true);
      form.reset({
        title: event.title,
        description: event.description || "",
        program: event.program?._id || "",
        category: event.category?.filter((cat): cat is eventCategoryEnumType => 
          Object.values(eventCategoriesEnums).includes(cat as eventCategoryEnumType)
        ) || [],
        location: event.location,
        status: event.status,
        priority: event.priority,
        assignedTo: event.assignedTo?.map(user => user._id) || [],
        cohost: event.cohost || [],
        requiredVolunteer: event.requiredVolunteer,
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : undefined,
        startTime: event.startTime ? new Date(event.startTime) : undefined,
        endTime: event.endTime ? new Date(event.endTime) : undefined,
        documents: event.documents || [],
        needTraining: event.needTraining,
      });
      setIsLoading(false);
    }
  }, [eventData, form]);

  // Process enums for select fields
  const statusOptions = transformOptions(Object.values(EventStatusEnum));
  const priorityOptions = transformOptions(Object.values(EventPriorityEnum));
  const categoryOptions = transformOptions(Object.values(eventCategoriesEnums));

  // Form submission handler
  const onSubmit = (values: z.infer<typeof updateEventSchema>) => {
    if (isPending) return;
    
    const formData = {
      ...values,
      program: values.program || undefined,
    };
    
    console.log("Updating event with data:", formData);
    
    mutate(formData, {
      onSuccess: (data) => {
        console.log("update event data res:", data);
        toast({
          title: "Success",
          description: "Event updated successfully",
          variant: "success",
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: ["all-events", orgId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ["event", eventId]
        });
        
        if (values.program) {
          queryClient.invalidateQueries({
            queryKey: ["program-analysis", values.program]
          });
        }
        
        setTimeout(() => onClose(), 500);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update event",
          variant: "destructive"
        });
      },
    });
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="mb-6 flex justify-between">
      <div className="flex items-center space-x-2">
        <div 
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            currentStep === FORM_STEPS.BASIC_INFO 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}
        >
          1
        </div>
        <span className={cn(
          "text-sm font-medium",
          currentStep === FORM_STEPS.BASIC_INFO ? "text-primary" : "text-muted-foreground"
        )}>
          Basic Information
        </span>
      </div>
      
      <div className="flex-1 mx-4 mt-4">
        <div className="h-1 bg-muted">
          <div 
            className="h-1 bg-primary" 
            style={{ width: currentStep === FORM_STEPS.BASIC_INFO ? "0%" : "100%" }}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div 
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            currentStep === FORM_STEPS.ADVANCED_DETAILS 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}
        >
          2
        </div>
        <span className={cn(
          "text-sm font-medium",
          currentStep === FORM_STEPS.ADVANCED_DETAILS ? "text-primary" : "text-muted-foreground"
        )}>
          Advanced Details
        </span>
      </div>
    </div>
  );

  if (eventLoading || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Edit Event
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            Update event details and management information
          </p>
        </div>
        
        <StepIndicator />
        
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === FORM_STEPS.BASIC_INFO && (
              <>
                {/* Step 1: Basic Information */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Event title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Beach Cleanup Day"
                              className="!h-[48px]"
                              disabled={!canEditEvent}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Event description
                            <span className="text-xs font-extralight ml-2">
                              Optional
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3} 
                              placeholder="Describe what the event is about" 
                              disabled={!canEditEvent}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Location <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Beach Road, Oceanside"
                              className="!h-[48px]"
                              disabled={!canEditEvent}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                
                  {/* Two-column layout for Program and Required Volunteers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Program Selection */}
                    <FormField
                      control={form.control}
                      name="program"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={!canEditEvent}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a program" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isProgramsLoading && (
                                <div className="my-2 flex justify-center">
                                  <Loader className="w-4 h-4 animate-spin" />
                                </div>
                              )}
                              <div className="w-full max-h-[200px] overflow-y-auto scrollbar">
                                {programOptions?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </div>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Required Volunteer Count */}
                    <FormField
                      control={form.control}
                      name="requiredVolunteer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Required Volunteers <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              className="!h-[48px]"
                              disabled={!canEditEvent}
                              {...field}
                              value={field.value || 0}
                              onChange={e => {
                                return field.onChange(parseInt(e.target.value) || 0)}}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dates - 3 columns on md+ screens */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Registration Deadline */}
                    <FormField
                      control={form.control}
                      name="registrationDeadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Deadline</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!canEditEvent}
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
                    
                    {/* Start Date */}
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!canEditEvent}
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
                                disabled={!canEditEvent}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* End Date */}
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!canEditEvent || !form.getValues().startTime}
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
                                disabled={(date) => {
                                  const startDate = form.getValues().startTime;
                                  return !canEditEvent || !startDate || date < startDate;
                                }}
                                initialFocus
                                fromDate={form.getValues().startTime}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(FORM_STEPS.ADVANCED_DETAILS)}
                    className="mt-4"
                    disabled={!canEditEvent}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            
            {currentStep === FORM_STEPS.ADVANCED_DETAILS && (
              <>
                {/* Step 2: Advanced Details */}
                <div className="space-y-4">
                                  
                  {/* Status & Priority - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!canEditEvent}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  className="!capitalize"
                                  placeholder="Select a status"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions?.map((status) => (
                                <SelectItem
                                  className="!capitalize"
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Priority */}
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!canEditEvent}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue 
                                  className="!capitalize" 
                                  placeholder="Select a priority" 
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions?.map((priority) => (
                                <SelectItem
                                  className="!capitalize"
                                  key={priority.value}
                                  value={priority.value}
                                >
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Categories Multi-Select Popover */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                          Categories
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground"
                                )}
                                disabled={!canEditEvent}
                              >
                                {field.value?.length
                                  ? `${field.value.length} categories selected`
                                  : "Select categories"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandEmpty>No category selected.</CommandEmpty>
                              <CommandGroup>
                                <div className="p-2 max-h-[250px] overflow-auto">
                                  {categoryOptions.map((category) => (
                                    <div key={category.value} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                                      <Checkbox
                                        id={`category-${category.value}`}
                                        disabled={!canEditEvent}
                                        checked={field.value?.includes(category.value as eventCategoryEnumType)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([...(field.value || []), category.value]);
                                          } else {
                                            field.onChange(field.value?.filter(val => val !== category.value) || []);
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`category-${category.value}`}
                                        className="text-sm cursor-pointer capitalize flex-grow"
                                      >
                                        {category.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {(field.value?.length !== undefined) && (field.value.length > 0)  && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {field.value.map((cat) => (
                              <Badge key={cat} variant="outline" className="flex items-center gap-1">
                                {cat.toLowerCase()}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => field.onChange((field.value !== undefined) && field.value.filter(c => c !== cat))}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Assigned Members Multi-Select Popover */}
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                          Assigned Members
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value?.length && "text-muted-foreground"
                                )}
                                disabled={!canEditEvent}
                              >
                                {field.value?.length
                                  ? `${field.value.length} members assigned`
                                  : "Assign members"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search members..." />
                              <CommandEmpty>No members selected.</CommandEmpty>
                              <CommandGroup>
                                {isMembersLoading ? (
                                  <div className="flex justify-center p-2">
                                    <Loader className="w-4 h-4 animate-spin" />
                                  </div>
                                ) : (
                                  <div className="p-2 max-h-[250px] overflow-auto">
                                    {membersData?.members?.map((member) => {
                                      const name = member.userId?.name || "Unknown";
                                      const initials = getAvatarFallbackText(name);
                                      const avatarColor = getAvatarColor(name);
                                      
                                      return (
                                        <div 
                                          key={member.userId._id} 
                                          className="flex items-center space-x-2 p-2 rounded hover:bg-muted"
                                        >
                                          <Checkbox 
                                            id={`member-${member.userId._id}`}
                                            disabled={!canEditEvent}
                                            checked={field.value?.includes(member.userId._id)}
                                            onCheckedChange={(checked) => {
                                              if (checked) {
                                                field.onChange([...(field.value || []), member.userId._id]);
                                              } else {
                                                field.onChange(field.value?.filter(val => val !== member.userId._id) || []);
                                              }
                                            }}
                                          />
                                          <label 
                                            htmlFor={`member-${member.userId._id}`}
                                            className="text-sm cursor-pointer flex items-center gap-2 flex-grow"
                                          >
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage src={member.userId.profilePicture || ""} alt={name} />
                                              <AvatarFallback className={avatarColor}>
                                                {initials}
                                              </AvatarFallback>
                                            </Avatar>
                                            {name}
                                          </label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {(field.value?.length !== undefined) && (field.value?.length > 0) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {field.value.map((memberId) => {
                              const member = membersData?.members?.find(m => m.userId._id === memberId);
                              if (!member) return null;
                              return (
                                <Badge key={memberId} variant="outline" className="flex items-center gap-1">
                                  {member.userId.name}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => field.onChange((field.value !== undefined) && field.value.filter(id => id !== memberId))}
                                  />
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cohost field (disabled) */}
                  <FormField
                    control={form.control}
                    name="cohost"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                          Co-host Organizations
                          <span className="text-xs font-extralight ml-2">
                            Coming Soon
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-muted-foreground"
                            disabled={true}
                          >
                            Select co-host organizations
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          This feature is not implemented yet. Coming soon!
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Documents */}
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
                                disabled={!canEditEvent}
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
                                disabled={!canEditEvent}
                              >
                                <X className="h-4 w-4" />
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
                            className="w-full flex items-center gap-1"
                            disabled={!canEditEvent}
                          >
                            <Plus className="h-4 w-4" /> Add Document
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Need Training */}
                  <FormField
                    control={form.control}
                    name="needTraining"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!canEditEvent}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Requires Training
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Check if volunteers need training before participation
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(FORM_STEPS.BASIC_INFO)}
                  >
                    Back
                  </Button>
                  
                  {canEditEvent && (
                    <Button
                      className="shrink-0 flex h-[40px] text-white font-semibold"
                      type="submit"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Event"
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
