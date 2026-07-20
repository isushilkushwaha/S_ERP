import { EmptyState } from "@/frontend/students/components/states";

export default function NotFound() {
  return (
    <EmptyState
      title="Student page not found"
      description="The requested student resource could not be found."
    />
  );
}