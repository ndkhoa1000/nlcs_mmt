import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowBigUp, ArrowBigDown, Loader, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
  icon?: LucideIcon;
  className?: string;
  iconColor?: string;
  variant?: "default" | "large";
}) => {
  const { 
    title, 
    value, 
    isLoading, 
    icon: Icon = Activity,
    className = "",
    iconColor = "text-muted-foreground",
    variant = "default"
  } = props;

  const getArrowIcon = () => {
    if (title.includes("Pending") || title.includes("Postponed")) {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-amber-500" />
      ) : (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-green-500" />
      );
    }
    if (title.includes("Completed") || title.includes("Active")) {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-red-500" />
      );
    }
    if (title.includes("Total")) {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-blue-500" />
      ) : null;
    }
    return null;
  };

  return (
    <Card className={cn(
      "shadow-none w-full transition-all hover:shadow-md", 
      variant === "large" ? "h-full" : "",
      className
    )}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 pb-2",
        variant === "large" ? "pt-6" : ""
      )}>
        <div className="flex items-center gap-1">
          <CardTitle className={cn(
            "font-medium",
            variant === "large" ? "text-lg" : "text-sm"
          )}>{title}</CardTitle>
          <div className="mb-[0.2px]">{getArrowIcon()}</div>
        </div>
        <Icon
          strokeWidth={2.5}
          className={cn("h-5 w-5", iconColor)}
        />
      </CardHeader>
      <CardContent className="w-full">
        <div className={cn(
          "font-bold",
          variant === "large" ? "text-4xl mt-4" : "text-3xl"
        )}>
          {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : value}
        </div>
        {variant === "large" && (
          <p className="text-muted-foreground mt-2 text-sm">
            Total count from all {title.split(' ').pop()?.toLowerCase()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
