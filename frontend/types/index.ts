export interface ForecastData {
	date: string;
	tempMax: number;
	tempMin: number;
	precipitation: number;
	humidityMax: number;
	humidityMin: number;
}

export interface SeasonalForecastData {
	seasonType: string;
	seasonStart: string;
	seasonEnd: string;
	averageRainfall: number;
	averageTemperature: number;
}

export interface Day {
	datetime: string;
	temp: number;
	humidity: number;
	precip: number;
}