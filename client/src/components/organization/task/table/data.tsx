import { EventPriorityEnum, EventStatusEnum } from "@/constant";
import { transformOptions } from "@/lib/helper";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  HelpCircle,
  Timer,
  View,
} from "lucide-react";

const statusIcons = {
  [EventStatusEnum.BACKLOG]: HelpCircle,
  [EventStatusEnum.TODO]: Circle,
  [EventStatusEnum.IN_PROGRESS]: Timer,
  [EventStatusEnum.IN_REVIEW]: View,
  [EventStatusEnum.DONE]: CheckCircle,
};

const priorityIcons = {
  [EventPriorityEnum.LOW]: ArrowDown,
  [EventPriorityEnum.MEDIUM]: ArrowRight,
  [EventPriorityEnum.HIGH]: ArrowUp,
};

export const statuses = transformOptions(
  Object.values(EventStatusEnum),
  statusIcons
);

export const priorities = transformOptions(
  Object.values(EventPriorityEnum),
  priorityIcons
);
