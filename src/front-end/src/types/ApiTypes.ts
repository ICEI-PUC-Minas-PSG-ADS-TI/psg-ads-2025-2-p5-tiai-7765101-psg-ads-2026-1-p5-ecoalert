export interface Pageable {
    number: number,
    size: number,
    totalElements: number,
    totalPages: number
}

export interface Filters {
  page: number;
  size?: number;
  sort?: Sort[];
  name?: string;
  category?: string;
}

export interface ListFilters extends Filters {
  status?: string;
  deliveryDate?: string;
}

export interface RentFilters extends ListFilters {
  returnDate?: string;
}

export type SortDirection = "asc" | "desc";

export interface Sort {
  field: string;
  direction: SortDirection;
}

export interface EntityPageable<T> {
  content: T[]
  page: Pageable
}
