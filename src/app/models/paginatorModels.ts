export type PaginatorResponse<T> = {
    currentPage: number;
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    dataList: T[];
}

export type PaginatorData = {
    currentPage: number;
    totalRecords: number;
    totalPages: number;
    pageSize: number;
}