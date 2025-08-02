import {
  Project,
  ProjectCreateResponse,
  ProjectResponse,
  ProjectType,
  ProjectUpdateBody,
  createProjectReqMapper,
} from "@/types";

import axiosInstance from "./axios";

// Get all projects for the current user
export const getProjects = async (
  id: string,
  page?: number,
  limit?: number,
) => {
  const params = new URLSearchParams();
  params.append("user", id);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  return axiosInstance
    .get<{
      data: ProjectResponse["data"][];
      total: number;
      page: number;
      limit: number;
    }>(`/projects${params.toString() ? `?${params.toString()}` : ""}`)
    .then((res) => res.data);
};

export const getProjectsRequests = async () => {
  return axiosInstance
    .get<{ data: ProjectResponse["data"][] }>("/projects/professional")
    .then((res) => res.data.data);
};

// Get a specific project by ID
export const getProject = async (id: string) => {
  return axiosInstance
    .get<{ data: ProjectResponse["data"] }>(`/projects/${id}`)
    .then((res) => res.data.data);
};

// Create a new project from URL
export const createProjectFromUrl = async (
  name: string,
  url: string,
  type: ProjectType,
): Promise<ProjectCreateResponse["data"]> => {
  return axiosInstance
    .post<ProjectCreateResponse>(
      "/projects",
      createProjectReqMapper({
        name,
        url,
        type,
      }),
    )
    .then((res) => res.data.data);
};

export const uploadProjectResultVideo = async (
  projectId: string,
  video: File,
): Promise<ProjectCreateResponse["data"]> => {
  const formData = new FormData();
  formData.append("video", video);

  return axiosInstance
    .post<ProjectCreateResponse>(`/projects/${projectId}/result`, formData)
    .then((res) => res.data.data);
};

// Update project settings
export const updateProject = async (id: string, data: ProjectUpdateBody) => {
  return axiosInstance
    .put<Project>(`/projects/${id}`, data)
    .then((res) => res.data);
};

export const generateVideo = async (id: string) => {
  return axiosInstance
    .post<Project>(`/projects/${id}/generate`)
    .then((res) => res.data);
};

// Delete a project
export const deleteProject = async (id: string) => {
  return axiosInstance.delete<void>(`/projects/${id}`).then(() => {});
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance
    .post<{ file_key: string }>(`/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const uploadProjectVideo = async (projectId: string, video: string) => {
  return axiosInstance
    .post<Project>(`/projects/${projectId}/result`, { file_key: video })
    .then((res) => res.data);
};
