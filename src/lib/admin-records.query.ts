import { queryOptions } from "@tanstack/react-query";
import { getAdminRecords } from "./admin-records.functions";

export const adminRecordsOptions = queryOptions({ queryKey: ["admin-records"], queryFn: () => getAdminRecords(), staleTime: 0 });