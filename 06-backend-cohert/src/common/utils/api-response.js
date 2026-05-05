class ApiResponse {
  // base method to handle sending the response
  static send(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data,
    });
  }

  // 200 ok - standard success response
  static ok(res, data = null, message = "Success") {
    return this.send(res, 200, message, data);
  }

  // 201 created - Used when a new resource is successfully created in the DB
  static created(res, data = null, message = "Resource created successfully") {
    return this.send(res, 201, message, data);
  }

  // 204 No Content - Used for successful deletions where no data needs to be returned
  static noContent(res) {
    return res.status(204).send();
  }
}

export default ApiResponse;
