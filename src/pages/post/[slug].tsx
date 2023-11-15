import React from "react";

import ErrorPage from "next/error";
import Image from "next/image";
import { useRouter } from "next/router";

import { Loader2 } from "lucide-react";
import { z } from "zod";

import HomeLayout from "~/components/layouts/home";
import { api } from "~/utils/api";

const PostDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const textIdParsed = z.string().uuid().parse(slug);
  const query = api.post.getDetailedPost.useQuery(textIdParsed, {});

  return (
    <HomeLayout>
      <main className="relative m-8 flex max-w-screen-md flex-col items-center gap-8">
        {query.isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.75} />
            <h3 className="">Loading...</h3>
          </>
        ) : query.isError || !query.data ? (
          <ErrorPage statusCode={404} />
        ) : (
          <>
            <div className="flex h-80 overflow-x-auto">
              {query.data.image.map((image, i) => (
                <Image
                  key={i}
                  src={image}
                  alt={"COVER"}
                  height={500}
                  width={500}
                  className="object-contain"
                />
              ))}
            </div>
            <h2 className="scroll-m-20 border-b pb-2 font-serif text-3xl font-semibold tracking-tight first:mt-0">
              {query.data.title}
            </h2>
            <p>{query.data.body}</p>
          </>
        )}
      </main>
    </HomeLayout>
  );
};

export default PostDetailPage;
