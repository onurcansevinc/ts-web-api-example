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
