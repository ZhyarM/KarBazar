export type OverviewDataType = {
  total_users: number;
  total_freelancers: number;
  total_clients: number;
  total_gigs: number;
  active_gigs: number;
  total_orders: number;
  pending_orders: number;
  in_progress_orders: number;
  completed_orders: number;
  total_revenue: number;
  platform_earnings: number;
  current_platform_fee: number;
  total_reviews: number;
  average_rating: number;
  total_categories: number;
  total_ads: number;
  active_ads: number;
  pending_ad_requests: number;
  ad_revenue: number;
  new_users_this_month: number;
  orders_this_month: number;
  revenue_this_month: number;
};

export type OverviewResponseType = {
  data: OverviewDataType;
};