import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { usersTable } from "../../database/schema/users.js";

export class AuthRepository {
  // 1. find a user by their email
  async findByEmail(email: string) {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return users[0] || null;
  }

  // 2. find a user by thier id
  async findById(id: string) {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return users[0] || null;
  }

  // 3. create a brand new user (used for resgistration)
  // We use `typeof usersTable.$inferInsert` so Drizzle automatically
  // knows exactly what fields are required to create a user!
  async create(userData: typeof usersTable.$inferInsert) {
    const newUser = await db.insert(usersTable).values(userData).returning();
    return newUser[0];
  }

  // 4. update user tokens
  async update(
    id: string,
    updateData: Partial<typeof usersTable.$inferInsert>,
  ) {
    const updateUser = await db
      .update(usersTable)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning();

    return updateUser[0];
  }
}

// export a single instance of the repository so we don't have to create a new one every time we want to use it
export const authRepository = new AuthRepository();
