import "reflect-metadata";
import express from "express";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { COOKIE_NAME, __prod__ } from "./constants";
import { MyContext } from "./types";
import { AppDataSource } from "./app-datasource";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

dotenv.config();

const main = async () => {
  await AppDataSource.initialize();
  const app = express();

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
  };
  app.use(cors(corsOptions));

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  //redisClient.connect().catch(console.error);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 10 years
        httpOnly: true,
        sameSite: "lax", //  csrf
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SECRET || "stray forza",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
    }),
    csrfPrevention: true,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  //! debug purpose
  // app.get("/", (req, res) => {
  //   console.log(req.session);
  //   req.session.userId = 5;
  //   res.send("hello");
  // });

  app.listen(4000, () => {
    console.log(`Server started on localhost:4000`);
  });
};

main().catch((err) => {
  console.log(err);
});
