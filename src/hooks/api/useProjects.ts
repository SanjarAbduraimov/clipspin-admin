import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  createProjectFromUrl,
  deleteProject,
  getProject,
  getProjects,
  getProjectsRequests,
  updateProject,
  generateVideo,
  uploadFile,
  uploadProjectVideo,
} from "@/api";
import { useAuthContext } from "@/auth/hooks/useAuthContext";
import {
  Project,
  ProjectProgress,
  projectResponseToProject,
  ProjectStatus,
  ProjectType,
  ProjectUpdateBody,
} from "@/types";

export const useProjects = (id: string, page?: number, limit?: number) => {
  const { authenticated } = useAuthContext();

  const res = useQuery({
    queryKey: ["projects", id, page, limit],
    queryFn: () => getProjects(id, page, limit),
    enabled: authenticated,
    select: (data) => {
      const projects = data.data
        ?.map(projectResponseToProject)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      return {
        data: projects || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
      };
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!authenticated) return;
      res.refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [authenticated]);

  return res;
};

export const useProjectsRequests = () => {
  const { authenticated } = useAuthContext();

  const res = useQuery({
    queryKey: ["projects-requests"],
    queryFn: getProjectsRequests,
    enabled: authenticated,
    select: (data) =>
      data
        .map(projectResponseToProject)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!authenticated) return;
      res.refetch();
    }, 100000);

    return () => clearInterval(interval);
  }, [authenticated]);

  return res;
};

export const useProject = (id: string) => {
  const res = useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProject(id),
    select: (data) => projectResponseToProject(data),
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const interval = setInterval(() => {
      res.refetch();
    }, 700);

    intervalRef.current = interval;

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!res.data) return;

    const project = res.data;

    if (
      project.status === ProjectStatus.COMPLETED ||
      project.status === ProjectStatus.FAILED ||
      project.status === ProjectStatus.CANCELLED
    ) {
      clearInterval(intervalRef.current);
    }

    if (project.progress === ProjectProgress.INPUT_ANALYZED) {
      clearInterval(intervalRef.current);
    }
  }, [res.data]);

  return res;
};

export const useCreateProjectFromUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      url,
      type,
    }: {
      name: string;
      url: string;
      type: ProjectType;
    }) => createProjectFromUrl(name, url, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdateBody }) =>
      updateProject(id, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", updatedProject.id],
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDuplicateProject = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: (project: Project) =>
      createProjectFromUrl(project.name, project.sourceUrl!, project.type),
    onSuccess: (data) => {
      navigate(`/project/${data._id}`);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useGenerateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      script,
    }: {
      projectId: string;
      script: string;
    }) => {
      await updateProject(projectId, { selected_idea: { script } });
      await generateVideo(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUploadProjectFile = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const { file_key: fileKey } = await uploadFile(file);
      const uploadProjectVideoResponse = await uploadProjectVideo(
        projectId,
        fileKey,
      );
      return uploadProjectVideoResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
