import type { User } from "@/domain/user";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAdmin(): Promise<User | null>;
}
