import Head from "next/head";
import { cacheWrite, cacheRead } from "@/lib/redis";

export default function Home({ redis }) {
  return (
    <div>
      <Head>
        <title>Redis Testg</title>
      </Head>

      <h1 style={{ fontSize: "4rem", margin: "14px 0" }}>{redis}</h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  cacheWrite("key", "data");
  // getting data (using the same key as above)
  const value = await cacheRead("key");

  return {
    props: {
      redis: await Promise.all(value),
    },
  };
}
