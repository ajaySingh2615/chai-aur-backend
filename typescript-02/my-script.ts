// Ek in memory DB

// HashMap (key, value)
//          T?    T?

type UserId = string;

interface User {
  id: UserId;
  fname: string;
  lname?: string | undefined;
  email: string;
  contact: {
    moblie: string;
  };
  address: {
    street: number;
    pin: number;
    country: string;
  };
}

class InMemoryDB {
  private _db: Map<UserId, User>;

  constructor() {}

  public insertUser(data: User): UserId {
    if (this._db.has(data.id)) {
      throw new Error(`User with ID ${data.id} already exists.`);
    }
    this._db.set(data.id, data);
    return data.id;
  }

  public updateUser(id: UserId, updateData: Omit<User, "id">): boolean {
    if (this._db.has(id)) {
      throw new Error(`User with ID ${id} does not exists`);
    }
    this._db.set(id, { ...updateData, id });
    return true;
  }

  public getUserById(id: UserId): User {
    if (!this._db.has(id))
      throw new Error(`User with ID ${id} does not exists.`);
    return this._db.get(id)!;
  }
}

const myDB = new InMemoryDB();
myDB.insertUser({
  id: "1",
  fname: "Piyush",
  email: "piyush@email.com",
  contact: {
    moblie: "99999",
  },
  address: {
    country: "In",
    pin: 147001,
    street: 1,
  },
});

myDB.updateUser(`1`, {
  fname: "Piyush",
  email: "piyush@email.com",
  contact: {
    moblie: "99999",
  },
  address: {
    country: "In",
    pin: 147001,
    street: 1,
  },
});
