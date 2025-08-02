import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Skeleton } from "@/components/Skeleton";
import { useProjects } from "@/hooks/api";

export const Statistics = () => {
  const { data: projects, isLoading } = useProjects("");

  if (!projects?.data.length) return null;

  const completedProjects =
    projects?.data.filter((p) => p.status === "completed").length || 0;
  const processingProjects =
    projects?.data.filter((p) => p.status === "in_progress").length || 0;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              projects?.data.length || 0
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : completedProjects}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : processingProjects}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
