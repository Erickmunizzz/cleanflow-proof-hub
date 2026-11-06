import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function AdminRecordsError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const query = useQueryErrorResetBoundary();
  return <div role="alert" className="space-y-4 py-8"><h1 className="text-xl font-semibold">Records couldn't be loaded</h1><p className="text-sm text-danger">{error.message}</p><Button onClick={() => { query.reset(); reset(); void router.invalidate(); }}>Try again</Button></div>;
}