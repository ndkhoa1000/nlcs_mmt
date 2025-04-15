import {
  EventPriorityEnum,
  EventPriorityEnumType,
  EventStatusEnum,
  EventStatusEnumType,
} from "@/constant";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

const useEventTableFilter = () => {
  return useQueryStates({
    status: parseAsStringEnum<EventStatusEnumType>(
      Object.values(EventStatusEnum)
    ),
    priority: parseAsStringEnum<EventPriorityEnumType>(
      Object.values(EventPriorityEnum)
    ),
    keyword: parseAsString,
    programId: parseAsString,
    assignedId: parseAsString,
  });
};

export default useEventTableFilter;
