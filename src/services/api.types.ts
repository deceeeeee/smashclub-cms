export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: Sort;
}

export interface PaginatedData<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}

export interface BaseResponse<T> {
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
    errorCode?: string;
    data: T;
}

export interface ValidationError {
    message: string;
    field: string;
    rejected_value: any;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
    errorCode: string;
    data: ValidationError[];
}
