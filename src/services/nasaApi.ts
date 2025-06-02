export interface APODData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface NearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

export interface NeoWsData {
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

class NASAApiService {
  private readonly apiKey: string;
  private readonly baseUrls = {
    apod: 'https://api.nasa.gov/planetary/apod',
    marsRover: 'https://api.nasa.gov/mars-photos/api/v1/rovers',
    neows: 'https://api.nasa.gov/neo/rest/v1'
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
  }

  async getAPOD(date?: string): Promise<APODData> {
    const url = new URL(this.baseUrls.apod);
    url.searchParams.append('api_key', this.apiKey);
    if (date) {
      url.searchParams.append('date', date);
    }

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`APOD API error: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Validate and process the response
      if (data.media_type === 'image') {
        // Note: NASA images may have CORS restrictions
        // The UI will handle this gracefully by showing a preview card
        console.log('APOD image URL:', data.url);
        console.log('Note: Due to CORS restrictions, images may not load directly in browser');
        
        // Keep the original URL - UI will handle CORS gracefully
        return data;
      }
      
      return data;
    } catch (error) {
      console.error('APOD API error:', error);
      throw error;
    }
  }

  async getMarsRoverPhotos(rover: 'curiosity' | 'opportunity' | 'spirit' = 'curiosity', sol?: number): Promise<MarsRoverPhoto[]> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        // Use more varied sol numbers for better variety
        const randomSol = sol || Math.floor(Math.random() * 2000) + Math.floor(Math.random() * 1000);
        
        const url = new URL(`${this.baseUrls.marsRover}/${rover}/photos`);
        url.searchParams.append('api_key', this.apiKey);
        url.searchParams.append('sol', randomSol.toString());
        url.searchParams.append('page', '1');

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`Mars Rover API error: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Filter and validate photos
        const validPhotos = data.photos.filter((photo: MarsRoverPhoto) => {
          return photo.img_src && 
                 photo.img_src.startsWith('http') && 
                 !photo.img_src.includes('placeholder');
        }).slice(0, 10);
        
        if (validPhotos.length === 0 && attempt < maxRetries - 1) {
          attempt++;
          continue; // Try different sol
        }
        
        return validPhotos;
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          console.error('Mars Rover API error after retries:', error);
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced from 1000ms
      }
    }
    
    return [];
  }

  async getNearEarthObjects(startDate?: string, endDate?: string): Promise<NeoWsData> {
    const today = new Date();
    const start = startDate || today.toISOString().split('T')[0];
    const end = endDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const url = new URL(`${this.baseUrls.neows}/feed`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('start_date', start);
    url.searchParams.append('end_date', end);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`NeoWs API error: ${response.statusText}`);
    }
    return response.json();
  }

  // Get random recent Mars Rover photo with better variety
  async getRandomMarsPhoto(): Promise<MarsRoverPhoto | null> {
    const rovers: Array<'curiosity' | 'opportunity' | 'spirit'> = ['curiosity', 'opportunity', 'spirit'];
    
    // Try multiple rovers if needed
    for (const rover of rovers) {
      try {
        const photos = await this.getMarsRoverPhotos(rover);
        if (photos.length > 0) {
          const selectedPhoto = photos[Math.floor(Math.random() * photos.length)];
          
          // Don't validate URL here to speed up - let UI handle it
          return selectedPhoto;
        }
      } catch (error) {
        console.error(`Error fetching ${rover} photos:`, error);
        continue;
      }
    }
    
    console.warn('No accessible Mars photos found');
    return null;
  }

  // Get multiple random Mars photos for variety
  async getMultipleMarsPhotos(count: number = 3): Promise<MarsRoverPhoto[]> {
    const allPhotos: MarsRoverPhoto[] = [];
    const rovers: Array<'curiosity' | 'opportunity' | 'spirit'> = ['curiosity', 'opportunity', 'spirit'];
    
    for (const rover of rovers) {
      try {
        const photos = await this.getMarsRoverPhotos(rover);
        allPhotos.push(...photos);
        
        if (allPhotos.length >= count) break;
      } catch (error) {
        console.log(`Skipping ${rover} for batch fetch:`, error);
        continue;
      }
    }
    
    // Shuffle and return requested count
    const shuffled = allPhotos.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Get this week's most interesting near-Earth objects
  async getInterestingNearEarthObjects(): Promise<NearEarthObject[]> {
    try {
      const data = await this.getNearEarthObjects();
      const allObjects: NearEarthObject[] = [];
      
      Object.values(data.near_earth_objects).forEach(dayObjects => {
        allObjects.push(...dayObjects);
      });

      // Sort by size and return the most interesting ones
      return allObjects
        .sort((a, b) => b.estimated_diameter.kilometers.estimated_diameter_max - a.estimated_diameter.kilometers.estimated_diameter_max)
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching near-Earth objects:', error);
      return [];
    }
  }
}

export const nasaApi = new NASAApiService(); 