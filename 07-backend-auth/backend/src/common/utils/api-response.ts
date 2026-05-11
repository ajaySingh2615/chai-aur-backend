export class ApiResponse<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // success if status code is less than 400
  }

  // 200 OK: Standard response for successful HTTP requests.
  static ok<T>(data: T, message = "Success") {
    return new ApiResponse(200, data, message);
  }

  // 201 Created: The request has been fulfilled, resulting in the creation of a new resource.
  static created<T>(data: T, message = "Resource created successfully") {
    return new ApiResponse(201, data, message);
  }
}
