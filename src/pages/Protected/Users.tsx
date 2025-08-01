import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { LogInIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import React, { useState } from "react";

import { Input } from "@/components/_form/Input/Input";
import { IconButton } from "@/components/Button";
import { Button } from "@/components/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog/Dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/DropdownMenu/DropdownMenu";
import DataTable from "../../components/Table/DataTable";
import {
  useUpdateUserRole,
  useUsers,
  useUpdateUserCredits,
} from "../../hooks/api/useUsers";
import { User } from "../../types";

const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState("");

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useUsers(page, limit);
  const { mutateAsync } = useUpdateUserRole();
  const { mutateAsync: updateCredits, isPending: isUpdatingCredits } =
    useUpdateUserCredits();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "_id",
      header: "ID",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "full_name",
      header: "Name",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original as User & { role?: string };
        return (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={async () => {
                    await mutateAsync({ id: user._id, role: "admin" });
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                  }}
                  disabled={user.role === "admin"}
                >
                  Set as Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await mutateAsync({ id: user._id, role: "editor" });
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                  }}
                  disabled={user.role === "editor"}
                >
                  Set as Editor
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={async () => {
                    await mutateAsync({ id: user._id, role: "user" });
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                  }}
                  disabled={user.role === "user"}
                >
                  Set as User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <IconButton
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedUserId(user._id);
                setCreditAmount("");
              }}
            >
              <PlusIcon />
            </IconButton>
            <IconButton size="sm" variant="outline">
              <LogInIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="mb-4 text-2xl font-bold">Users</h1>
        <div className="text-red-500">Error loading users: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Users</h1>
      <DataTable
        columns={columns}
        data={(data as any)?.data || []}
        isLoading={isLoading}
        rowCount={data?.total || 0}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        onPaginationChange={(updater) => {
          const newPagination =
            typeof updater === "function"
              ? updater({ pageIndex: page - 1, pageSize: limit })
              : updater;
          setPage(newPagination.pageIndex + 1);
          setLimit(newPagination.pageSize);
        }}
      />
      {/* Credit Addition Dialog */}
      <Dialog
        open={!!selectedUserId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserId(null);
            setCreditAmount("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>
              Add credits to user account. Enter the amount of credits to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="credits">Credits</label>
              <Input
                id="credits"
                type="number"
                placeholder="Enter amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                !creditAmount ||
                isUpdatingCredits ||
                parseInt(creditAmount, 10) <= 0
              }
              onClick={async () => {
                if (selectedUserId && creditAmount) {
                  await updateCredits({
                    id: selectedUserId,
                    amount: parseInt(creditAmount, 10),
                  });
                  queryClient.invalidateQueries({ queryKey: ["users"] });
                  setSelectedUserId(null);
                  setCreditAmount("");
                }
              }}
            >
              {isUpdatingCredits ? "Adding..." : "Add Credits"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
