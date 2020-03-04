import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, YellowBox } from "react-native";
import { getRepository } from "typeorm/browser";

import { Category } from "./entities/category";
import { Author } from "./entities/author";
import { Post } from "./entities/post";

type Props = {};

YellowBox.ignoreWarnings(["Require cycle: src/entities/"]);
export const Root: React.FC<Props> = () => {
  const [progress, setProgress] = useState<string>("Post is being saved");
  const [posts, setPosts] = useState<Post | null>(null);
  useEffect(() => {
    async function runDemo() {
      const category1 = new Category();
      category1.name = "TypeScript";

      const category2 = new Category();
      category2.name = "Programming";

      const author = new Author();
      author.name = "Person";

      const post = new Post();
      post.title = "Control flow based type analysis";
      post.text =
        "TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.";
      post.categories = [category1, category2];
      post.author = author;

      const postRepository = getRepository(Post);
      await postRepository.save(post);

      console.log("Post has been saved");
      setProgress("Post has been saved");

      const loadedPost = await postRepository.findOne({
        where: { id: post.id },
        relations: ["author", "categories"]
      });

      if (loadedPost) {
        console.log("Post has been loaded: ", loadedPost);
        setPosts(loadedPost);
      }

      const authorRepository = getRepository(Author);
      const _author = await authorRepository.findOne({
        where: { id: 2 },
        relations: ["posts"]
      });
      console.log(_author);
    }
    runDemo();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to the Expo Example for TypeORM!
      </Text>
      <Text style={styles.small}>{progress}</Text>
      <Text style={styles.small}>{JSON.stringify(posts, null, 2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingHorizontal: 20
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  small: {
    // textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
