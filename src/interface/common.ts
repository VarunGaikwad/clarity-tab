export interface WeatherResponse {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
  cod: number;
  id: number;
  timezone: number;
  base: string;
  visibility: number;
}

interface LinkType {
  title: string;
  url: string;
}

export interface UserDataType {
  displayName: string;
  startTime: string;
  endTime: string;
  links: LinkType[];
  isAuth: boolean;
  weather: WeatherResponse;
  lastDate: string;
  timeZones: TimeZoneType[];
  unsplashImage: UnsplashImageType;
  isBusSchedule: boolean;
}

export interface UserContextType {
  userData?: UserDataType;
  setUserData?: React.Dispatch<React.SetStateAction<UserDataType>>;
}

interface UnsplashImageType {
  width: number;
  height: number;
  color: string | null;
  blur_hash: string | null;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string | null;
    full: string | null;
    regular: string | null;
    small: string | null;
    thumb: string | null;
    small_s3: string | null;
  };
  links: {
    self: string | null;
    html: string | null;
    download: string | null;
    download_location: string | null;
  };

  user: {
    id: string | null;
    updated_at: string | null;
    username: string | null;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    twitter_username: string | null;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: {
      self: string | null;
      html: string | null;
      photos: string | null;
      likes: string | null;
      portfolio: string | null;
      following?: string | null; // 👈 optional
      followers?: string | null; // 👈 optional
    };
    profile_image: {
      small: string | null;
      medium: string | null;
      large: string | null;
    };
    instagram_username: string | null;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    total_promoted_photos: number;
    total_illustrations: number;
    total_promoted_illustrations: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: {
      instagram_username: string | null;
      portfolio_url: string | null;
      twitter_username: string | null;
      paypal_email: string | null;
    };
  };
}

export interface TimeZoneType {
  title: string;
  zone: string;
}
