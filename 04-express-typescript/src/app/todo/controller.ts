import type { Request, Response } from "express";
import type { Todo } from "../../validation/todo.shema.js";

class TodoController {
  private _db: Todo[];

  constructor() {
    this._db = [];
  }

  public handleGetAllTodos(req: Request, res: Response) {
    const todos = this._db;
    return res.json({ todos });
  }
}

export default TodoController;
