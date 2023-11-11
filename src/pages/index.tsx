import React from "react";

import Head from "next/head";

import { Loader2 } from "lucide-react";

import HomeLayout from "~/components/layouts/home";
import PostCard from "~/components/postCard";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import useMediaQuery from "~/utils/useMediaQuery";

const Home = () => {
  const mdScreenSize = useMediaQuery("(min-width: 768px)");
  const lgScreenSize = useMediaQuery("(min-width: 1024px)");
  const xlScreenSize = useMediaQuery("(min-width: 1900px)");

  return (
    <HomeLayout>
      <main className="flex flex-col items-center">
        <Feed
          columnCounts={
            xlScreenSize ? 5 : lgScreenSize ? 4 : mdScreenSize ? 2 : 1
          }
        />
      </main>
    </HomeLayout>
  );
};

const Feed = ({ columnCounts }: { columnCounts: 1 | 2 | 3 | 4 | 5 }) => {
  const { data, fetchNextPage, refetch, isLoading } =
    api.post.getPosts.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  {
    /* Don’t construct TailwindCSS class names dynamically
    SEE -> https://tailwindcss.com/docs/content-configuration#class-detection-in-depth */
  }

  React.useEffect(() => {
    // forcing a refetch otherwise trpc query won't run on window refresh
    refetch().catch((err) => {
      console.log(err);
    });
  }, [refetch]);

  const gridColumnTemplates = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  const posts = data?.pages.flatMap((page) => page.posts);

  return (
    <>
      <Head>
        <title>ShopBetter AI.</title>
      </Head>
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.75} />
          <h3 className="">Loading...</h3>
        </>
      ) : (
        <>
          <div
            className={`my-4 grid md:max-w-4xl lg:mx-32 lg:max-w-[1900px] ${gridColumnTemplates[columnCounts]}`}
          >
            {/* Looping through a fake array */}
            {Array.from({ length: columnCounts }).map((_, columnNum) => (
              <>
                <div key={columnNum}>
                  {posts
                    ?.filter((_, index) => index % columnCounts === columnNum)
                    .map((post, index) => (
                      <PostCard key={index} {...post} />
                    ))}
                </div>
              </>
            ))}
          </div>
          <Button
            onClick={() => {
              void fetchNextPage();
            }}
          >
            Load More
          </Button>
        </>
      )}
    </>
  );
};

export default Home;
