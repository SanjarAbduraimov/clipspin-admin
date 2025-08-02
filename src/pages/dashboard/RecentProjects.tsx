import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProjectStatusLabel } from "@/modules/project/libs/getProjectStatusLabel";

import { useAuthContext } from "@/auth/hooks/useAuthContext";
import { Input } from "@/components/_form/Input";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader } from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { useProjects } from "@/hooks/api";
import { Project, ProjectStatusColors, ProjectTypeLabels } from "@/types";

export const RecentProjects = () => {
  const { userId } = useParams<{ userId: string }>();
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Project Name",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Link
            to={`/project/${project.id}`}
            className="font-medium hover:underline"
          >
            {project.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Badge
            className="whitespace-nowrap"
            variant={ProjectStatusColors[project.status]}
          >
            {getProjectStatusLabel(project)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Project Type",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Badge className="whitespace-nowrap">
            {ProjectTypeLabels[project.type]}
          </Badge>
        );
      },
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const { data, isLoading, error } = useProjects(userId || "", page, limit);
  const projects = data?.data || [];
  const totalProjects = data?.total || 0;

  const { authenticated } = useAuthContext();

  if (!authenticated) return null;

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="container mx-auto mt-10">
      <h1 className="mb-4 text-2xl font-bold">User Projects</h1>
      <Card className="">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="py-8 text-center text-error">
              Error loading projects. Please try again.
            </div>
          )}
          {filteredProjects?.length === 0 && !isLoading && !error ? (
            <div className="py-8 text-center text-gray-500">
              No projects found.
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredProjects || []}
              rowCount={totalProjects}
              pagination={pagination}
              onPaginationChange={(updater) => {
                const newPagination =
                  typeof updater === "function" ? updater(pagination) : updater;
                setPagination(newPagination);
                setPage(newPagination.pageIndex + 1);
                setLimit(newPagination.pageSize);
              }}
              isLoading={isLoading}
              emptyState={
                <div className="py-8 text-center text-gray-500">
                  No projects found.
                </div>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
