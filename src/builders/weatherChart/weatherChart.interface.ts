export interface HourlyWeather {
    dateTime: string;
    temp: number;
    windDirection: number;
    sunElevation: number;
    sunMinutes: number;
}

export interface Mark {
    x: number,
    y: number,
    r: number,
    time: number,
    color: number,
}

export interface WeatherAttributes {
    tMin: number;
    tMax: number;
    precipation: number;
    precipationChance: number;
    windDirection: number;
    windSpeed: number;
    sunrise: Date;
    sunset: Date;
    hourly: HourlyWeather[];
}

export interface DailyWeather {
    type: "dayboxes";
    id: string;
    attributes: WeatherAttributes;
}

export interface WeatherData {
    data: DailyWeather[];
}
