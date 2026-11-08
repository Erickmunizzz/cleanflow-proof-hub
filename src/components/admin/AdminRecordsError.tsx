import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function AdminRecordsError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const query = useQueryErrorResetBoundary();
  const message = error instanceof Error ? error.message : "Your workspace records are unavailable. Please try again.";
  return <div role="alert" className="space-y-4 py-8"><h1 className="text-xl font-semibold">Records couldn't be loaded</h1><p className="text-sm text-danger">{message}</p><Button onClick={() => { query.reset(); reset(); void router.invalidate(); }}>Try again</Button></div>;
}