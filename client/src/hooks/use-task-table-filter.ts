import {
  EventPriorityEnum,
  EventPriorityEnumType,
  EventStatusEnum,
  EventStatusEnumType,
} from "@/constant";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

const useTaskTableFilter = () => {
  return useQueryStates({
    status: parseAsStringEnum<EventStatusEnumType>(
      Object.values(EventStatusEnum)
    ),
    priority: parseAsStringEnum<EventPriorityEnumType>(
      Object.values(EventPriorityEnum)
    ),
    keyword: parseAsString,
    projectId: parseAsString,
    assigneeId: parseAsString,
  });
};

export default useTaskTableFilter;
