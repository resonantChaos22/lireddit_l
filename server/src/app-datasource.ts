import { DataSource } from "typeorm";
import { __dbpass__, __dbuser__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  database: "lireddit",
  username: __dbuser__,
  password: __dbpass__,
  logging: true,
  synchronize: true,
  entities: [User, Post],
});
