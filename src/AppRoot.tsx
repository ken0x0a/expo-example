import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { createConnection } from "typeorm/browser";
import { Category } from "./entities/category";
import { Author } from "./entities/author";
import { Post } from "./entities/post";
import { Root } from "./Root";

type IAppProps = {};
export const App: React.FC<IAppProps> = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    async function init() {
      await createConnection({
        database: "test",
        driver: SQLite,
        entities: [Author, Category, Post],
        synchronize: true,
        type: "expo"
      });
      setLoaded(true);
    }
    init();
  }, []);

  if (loaded) return <Root />;
  return null;
};
