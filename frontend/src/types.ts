export interface VideoItem {
  videoId: string;
  title: string;
  url: string;
  channel: string;
  views: string;
  published: string;
  thumbnail: string;
  index?: number;
  scriptSnippet?: string;
  full_script?: string;
  full_comments?: string;
  hook_frames_url?: string;
  outlier_score?: number; // e.g. 14.5x
  is_pure_idea?: boolean; // Small channel outlier (<50k subs with 500k+ views)
  engagement_rate?: string; // e.g. 4.2%
  vph?: string; // Views per hour momentum
}

export interface CompetitorSummary {
  common_thumbnail_pattern: string;
  winning_hook_strategy: string;
  audience_pain_points: string[];
  comment_keywords?: string[];
  sentiment_breakdown?: {
    curiosity: number;
    shock: number;
    skepticism: number;
  };
}

export interface ThumbnailBlueprint {
  text_overlay: string;
  visual_composition: string;
  image_gen_prompt: string;
}

export interface TimelineSection {
  time_range: string;
  section: string;
  narration: string;
  visual_prompt: string;
}

export interface SeoPackage {
  primary_keywords: string[];
  optimized_description: string;
  youtube_tags_500: string;
  hashtags: string[];
  chapters?: { time: string; title: string }[];
}

export interface CtrStrategy {
  title_options: {
    type: string;
    title: string;
    predicted_ctr: string;
    psychological_trigger: string;
  }[];
  thumbnail_concept: {
    text_overlay: string;
    contrast_colors: string;
    visual_focus: string;
    safe_zone_rule: string;
  };
}

export interface CtaStrategy {
  pinned_comment: string;
  in_video_cta: string;
  engagement_bait_tip: string;
}

export interface AlgorithmScorecard {
  predicted_vvsa: string;
  target_apv: string;
  seo_strength: number;
  algorithm_verdict: string;
}

export interface NewVideoPlan {
  titles: string[];
  thumbnail_blueprint: ThumbnailBlueprint;
  script_and_visual_timeline: TimelineSection[];
  loop_bridge?: string; // 30s Shorts infinite loop connection phrase
  format_type?: 'shorts' | 'longform';
  seo_package?: SeoPackage;
  ctr_strategy?: CtrStrategy;
  cta_strategy?: CtaStrategy;
  algorithm_scorecard?: AlgorithmScorecard;
}

export interface ResultPlan {
  competitor_summary: CompetitorSummary;
  new_video_plan: NewVideoPlan;
}

export interface ProjectData {
  keyword: string;
  autocomplete: string[];
  serp_image_url: string | null;
  videos: VideoItem[];
  result_plan: ResultPlan | null;
}

export interface ProjectSummary {
  keyword: string;
  created_at: number;
  has_summary: boolean;
  has_plan: boolean;
  has_serp: boolean;
  video_count: number;
}

export interface ScoutStatus {
  is_running: boolean;
  keyword: string;
  stage: string;
  progress: number;
  message: string;
  current_video: number;
  total_videos: number;
  latest_screen: string | null;
  error?: string | null;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  level: "info" | "action" | "success" | "warning" | "error";
  message: string;
  step?: string;
}

export interface DropoffPoint {
  time_stamp: string;
  drop_percentage: string;
  issue_type: string;
  diagnosis: string;
  prescription: string;
}

export interface ChannelDiagnosis {
  retention_health_score: number;
  critical_dropoffs: DropoffPoint[];
  ctr_vs_retention_quadrant: {
    status: string;
    benchmark_comparison: string;
    action_items: string[];
  };
}
