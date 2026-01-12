export default interface PageResponse<T> {
    data: T[];
    currentPage: number;
    totalElements: number;
    totalPage: number;
    pageSize: number;
}