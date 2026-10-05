import type { Dispatch, SetStateAction } from "react";
import type { SiteContent } from "./defaultContent";

export interface MediaItem {
  id: number;
  name: string;
  dataUrl: string;
  size: number;
  date: string;
}

export interface QuoteRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  commune: string;
  message: string;
  date: string;
  status: string;
}

export type SetContent = Dispatch<SetStateAction<SiteContent>>;
export type SetMedia = Dispatch<SetStateAction<MediaItem[]>>;
export type SetRequests = Dispatch<SetStateAction<QuoteRequest[]>>;
export type ToastFn = (msg: string, type?: string) => void;
