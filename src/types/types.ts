export interface Employee {
    ad: string;
    soyad: string;
    email: string;
    pozisyon: string;
    ise_giris_tarihi: string;
    maas: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error: string | undefined;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    store_id: number;
    category_id: number;
    rating: number;
    sell_count: number;
    images: {
        url: string;
        index: number;
    }[];
}

export interface Weather {
    city: string;
    temperature: number;
    condition: string;
}

export interface WeatherAPIResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}
