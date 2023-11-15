import Image from "next/image";
import Link from "next/link";

import { type PostOutput } from "~/utils/api";
import { parser } from "~/utils/helpers/parser";

import { Button } from "./ui/button";

//select randomly from the resolutions

const PostCard = (props: PostOutput) => {
  return (
    <div className="-z-0 m-4 flex flex-col space-y-1">
      {props.image && (
        <Link
          href={`/post/${props.textId}`}
          className="group relative rounded-2xl transition-all"
        >
          <div className="absolute left-0 top-0 z-10 hidden h-full w-full flex-col place-items-center justify-center space-y-4 rounded-md bg-black bg-opacity-30 transition-all hover:backdrop-blur-md group-hover:flex">
            <Button
              variant={"ghost"}
              className="bg-black bg-opacity-40 text-white"
            >
              <Link href={`/home/post-detail/${props.textId}`}>
                View detail
              </Link>
            </Button>
          </div>
          <Image
            src={props.image}
            alt={props.tagline}
            height={500}
            width={500}
            className="rounded-md transition-all duration-[0.3s] ease-in"
          />
        </Link>
      )}

      <Link
        href={`/home/post-detail/${props.textId}`}
        className="hover:underline"
      >
        <h3 className="line-clamp-3 scroll-m-20 px-2 text-[16px] font-semibold tracking-tight transition-all hover:line-clamp-none">
          {parser.tagline.trim(props.tagline)}
        </h3>
      </Link>
    </div>
  );
};

export default PostCard;
