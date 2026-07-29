import type { SchoolProfile } from "./school-profile";

export interface SchoolProfileResponse {
  data: SchoolProfile;
  message: string;
}

export interface SchoolProfileListResponse {
  data: SchoolProfile[];
  message: string;
}