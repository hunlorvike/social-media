export class BaseResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string;

    constructor(statusCode: number, message: string, data?: T, error?: string) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    static success<T>(message: string, data?: T): BaseResponse<T> {
        return new BaseResponse<T>(200, message, data);
    }

    static error<T>(statusCode: number, message: string, error?: string): BaseResponse<T> {
        return new BaseResponse<T>(statusCode, message, undefined, error);
    }
}
