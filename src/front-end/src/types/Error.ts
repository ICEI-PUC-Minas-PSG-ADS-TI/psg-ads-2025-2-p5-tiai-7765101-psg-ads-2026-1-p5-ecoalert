export interface ApiErrorResponse {
  message: string;
  status: number;
  error: string;
  time: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  error: string;
  time: string;
  fields?: Record<string, string>;

  constructor(response: ApiErrorResponse) {
    super(response.message);

    this.name = "ApiError";
    this.status = response.status;
    this.error = response.error;
    this.time = response.time;
    this.fields = response.fields;
  }
}