// Project Types

import { BadgeProps } from "@/components/Badge";
import { config } from "@/constants/config";

export type VideoSource = "youtube" | "tiktok" | "instagram";

export type VideoFormat = "MP4" | "MOV";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export type Resolution = "720p" | "1080p" | "4K";

export type AudioQuality = "standard" | "high";

export type PresenterType = "ai" | "human";

export interface Transcription {
  id: string;
  text: string;
  timestamps: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language: string;
}

export enum ProjectType {
  slide_show = "slide_show",
  text_audiogram = "text_audiogram",
  talking_head = "talking_head",
  professional = "professional",
}

export enum ProjectStatus {
  QUEUED = "queued",
  IN_PROGRESS = "in_progress",
  CANCELLED = "cancelled",
  FAILED = "failed",
  COMPLETED = "completed",
  // PENDING = "pending",
  // CANCELLED = "cancelled",
  // FAILED = "failed",
  // COMPLETED = "completed",
}

export enum ProjectProgress {
  FETCHING_INPUT = "fetching_input",
  INPUT_FETCHED = "input_fetched",

  ANALYZING_INPUT = "analyzing_input",
  INPUT_ANALYZED = "input_analyzed",

  GENERATING_SCRIPT = "generating_script",
  SCRIPT_GENERATED = "script_generated",

  GENERATING_IMAGES = "generating_images",
  IMAGES_GENERATED = "images_generated",

  GENERATING_VIDEO = "generating_video",
  VIDEO_GENERATED = "video_generated",

  SAVING_RESULTS = "saving_results",
  RESULTS_SAVED = "results_saved",
  // FETCHING_INPUT = "fetching_input",
  // ANALYZING_INPUT = "analyzing_input",
  // GENERATING_SCRIPT = "generating_script",
  // SCRIPT_GENERATED = "summary_generated",
  // GENERATING_IMAGES = "generating_images",
  // GENERATING_VIDEO = "generating_video",
}

// {
//   "_id": "684bfe20886012479d1e558c",
//   "title": "Ibrohim",
//   "type": "slide_show",
//   "input": {
//       "url": "https://www.instagram.com/reel/DFK_lARJBVC"
//   },
//   "suggested_ideas": [],
//   "status": "queued"
// }

export enum ProjectErrorCause {
  INVALID_URL = "invalid_url",
  UNSUPPORTED_URL = "unsupported_url",
  FAILED_TO_DOWNLOAD = "failed_to_download",
  FAILED_TO_SAVE = "failed_to_save",
  FAILED_TO_PARSE = "failed_to_parse",
  FAILED_TO_ANALYZE = "failed_to_analyze",
  FAILED_TO_GENERATE_VIDEO = "failed_to_generate_video",
  FAILED_TO_GENERATE_SCENES = "failed_to_generate_scenes",
  FAILED_TO_GENERATE_SCRIPTS = "failed_to_generate_scripts",
  UNKNOWN_ERROR = "unknown_error",
}

export interface ProjectResponse {
  data: {
    _id: string;
    title: string;
    created_at: string;
    input: {
      url: string;
      source?: VideoSource;
      file_key?: string;
    };
    suggested_ideas: { script: string }[];
    status: ProjectStatus;
    progress: ProjectProgress;
    type: ProjectType;
    file_key: string;
    error_cause?: ProjectErrorCause;
    selected_idea?: {
      script: string;
    };
    output?: {
      file_key: string;
    };
  };
}

export interface CreateProjectReq {
  title: string;
  input: {
    url: string;
  };
  type: ProjectType;
}

export interface CreateProject {
  name: string;
  url: string;
  type: ProjectType;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: ProjectProgress;
  createdAt: string;
  completedAt?: string;
  source?: string;
  sourceUrl?: string;
  sourceFile?: string;
  sourceType?: VideoSource;
  type: ProjectType;
  originalDuration?: number;
  generatedDuration?: number;
  suggestedIdeas: string[];
  selectedIdea?: string;
  outputSettings?: {
    resolution: Resolution;
    aspectRatio: AspectRatio;
    audioQuality: AudioQuality;
    format: VideoFormat;
  };
  presenterSettings?: {
    type: PresenterType;
    presenterId: string;
  };
  outputUrl?: string;
  errorCause: ProjectErrorCause;
}

export interface ProjectUpdateBody {
  title?: string;
  selected_idea?: { script: string };
}

export interface Presenter {
  id: string;
  name: string;
  type: PresenterType;
  thumbnailUrl: string;
  description: string;
  tags: string[];
}

export interface User {
  _id: string;
  full_name: string;
  email: string;
  avatar?: string;
  usageStats: {
    projectsCreated: number;
    projectsCompleted: number;
    totalProcessingTime: number;
  };
}

export interface ProjectCreateResponse {
  data: {
    _id: string;
  };
}

export const ProjectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.slide_show]: "Slide Show",
  [ProjectType.text_audiogram]: "Text Audiogram",
  [ProjectType.talking_head]: "Talking Head",
  [ProjectType.professional]: "Professional",
};

export const ProjectStatusColors: Record<ProjectStatus, BadgeProps["variant"]> =
  {
    [ProjectStatus.QUEUED]: "default",
    [ProjectStatus.IN_PROGRESS]: "outline-warning",
    [ProjectStatus.CANCELLED]: "outline-error",
    [ProjectStatus.FAILED]: "outline-error",
    [ProjectStatus.COMPLETED]: "outline-success",
  };

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.QUEUED]: "Queued",
  [ProjectStatus.IN_PROGRESS]: "In Progress",
  [ProjectStatus.CANCELLED]: "Cancelled",
  [ProjectStatus.FAILED]: "Failed",
  [ProjectStatus.COMPLETED]: "Completed",
};

export const ProjectProgressLabels: Record<ProjectProgress, string> = {
  [ProjectProgress.FETCHING_INPUT]: "Fetching input",
  [ProjectProgress.INPUT_FETCHED]: "Input fetched",
  [ProjectProgress.ANALYZING_INPUT]: "Analyzing input",
  [ProjectProgress.INPUT_ANALYZED]: "Input analyzed",
  [ProjectProgress.GENERATING_SCRIPT]: "Generating script",
  [ProjectProgress.SCRIPT_GENERATED]: "Script generated",
  [ProjectProgress.GENERATING_IMAGES]: "Generating images",
  [ProjectProgress.IMAGES_GENERATED]: "Images generated",
  [ProjectProgress.GENERATING_VIDEO]: "Generating video",
  [ProjectProgress.VIDEO_GENERATED]: "Video generated",
  [ProjectProgress.SAVING_RESULTS]: "Saving results",
  [ProjectProgress.RESULTS_SAVED]: "Results saved",
};

export function projectResponseToProject(
  projectResponse: ProjectResponse["data"],
): Project {
  const sourceType = projectResponse.input.source;

  return {
    id: projectResponse._id,
    name: projectResponse.title,
    status: projectResponse.status,
    createdAt: projectResponse.created_at,
    selectedIdea: projectResponse.selected_idea?.script,
    suggestedIdeas: projectResponse.suggested_ideas.map((idea) => idea.script),
    progress: projectResponse.progress,
    completedAt: new Date().toISOString(),
    source: projectResponse.input.url,
    sourceUrl: `${config.apiBaseUrl}/files/${projectResponse.input.file_key}`,
    sourceFile: undefined,
    sourceType,
    type: projectResponse.type,
    originalDuration: undefined,
    generatedDuration: undefined,
    outputSettings: undefined,
    presenterSettings: undefined,
    errorCause: projectResponse.error_cause || ProjectErrorCause.UNKNOWN_ERROR,
    outputUrl: projectResponse.output?.file_key
      ? `${config.apiBaseUrl}/files/${projectResponse.output.file_key}`
      : undefined,
  };
}

export const createProjectReqMapper = (
  body: CreateProject,
): CreateProjectReq => {
  return {
    title: body.name,
    input: {
      url: body.url,
    },
    type: body.type,
  };
};
