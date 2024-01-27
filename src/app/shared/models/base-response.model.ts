export interface BaseResponseModel<T> {
    status: string;
    message: string;
    logs: any;
    data: T;
}