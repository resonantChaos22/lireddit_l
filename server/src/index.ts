import { MikroORM } from "@mikro-orm/core";
//import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
};

main().catch((err) => {
  console.log(err);
});
