import type { User } from "@/domain/user";
import { mockAdminUser } from "@/lib/mock";
import type { UserRepository } from "./user.repository";

export class MockUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return mockAdminUser.id === id ? mockAdminUser : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return mockAdminUser.email === email ? mockAdminUser : null;
  }

  async findAdmin(): Promise<User | null> {
    return mockAdminUser;
  }
}
