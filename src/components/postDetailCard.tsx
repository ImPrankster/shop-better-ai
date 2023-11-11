import React from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRightFromCircle,
  AtSign,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  SmilePlus,
  Star,
} from "lucide-react";

import { type DetailedPostOutput } from "~/utils/api";
import { blurURL } from "~/utils/helpers/blurURL";
import { parser } from "~/utils/helpers/parser";
import useMediaQuery from "~/utils/useMediaQuery";

import Comment from "./comment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const referralLink = "https://vitessehome.com?ref=alpha_park";

const comments = [
  {
    name: "Alpha Park",
    comment:
      "This product is a must-have for any serious user. With its ergonomic design, adjustable features, and comfortable materials, its the perfect choice for anyone looking to take their experience to the next level!",
  },
  {
    name: "Alpha Park",
    comment:
      "This product is a must-have for any serious user. With its ergonomic design, adjustable features, and comfortable materials, its the perfect choice for anyone looking to take their experience to the next level!",
  },
  {
    name: "Alpha Park",
    comment:
      "This product is a must-have for any serious user. With its ergonomic design, adjustable features, and comfortable materials, its the perfect choice for anyone looking to take their experience to the next level!",
  },
  {
    name: "Alpha Park",
    comment:
      "This product is a must-have for any serious user. With its ergonomic design, adjustable features, and comfortable materials, its the perfect choice for anyone looking to take their experience to the next level!",
  },
];

const PostDetailCard = (props: DetailedPostOutput) => {
  const descRef = React.useRef<HTMLParagraphElement>(null);
  const [isLongDesc, setIsLongDesc] = React.useState(false);
  const [imageIdx, setImageIdx] = React.useState(0);
  const title = props && parser.tagline.trim(props.title);
  const mdScreenSize = useMediaQuery("(min-width: 768px)");
  const lgScreenSize = useMediaQuery("(min-width: 1024px)");
  const xlScreenSize = useMediaQuery("(min-width: 1900px)");

  const onSwitchImageLeft = () => {
    if (imageIdx === 0) return;

    setImageIdx((prev) => (prev -= 1));
  };

  const onSwitchImageRight = () => {
    const maxIdx = props.image?.length - 1;

    if (imageIdx === maxIdx) return;
    setImageIdx((prev) => (prev += 1));
  };

  const onMore = () => {
    if (descRef.current && !isLongDesc) {
      descRef.current.classList.remove("line-clamp-3");
      setIsLongDesc(true);
    }
  };

  const onLess = () => {
    if (descRef.current && isLongDesc) {
      descRef.current.classList.add("line-clamp-3");
      setIsLongDesc(false);
    }
  };

  return (
    <div className="relative -z-0 my-16 grid h-[75vh] w-[67%] grid-cols-2 gap-6 space-y-1 rounded-2xl shadow-2xl">
      {/* <-- Product Images --> */}
      <div className="relative col-span-1 flex h-[75vh] rounded-l-lg bg-black shadow-2xl">
        <div className="relative my-auto h-[65%] w-full">
          {props.image?.map((img, i) =>
            i === imageIdx ? (
              <Image
                key={i}
                src={img}
                fill
                alt={props.title}
                placeholder="blur"
                blurDataURL={blurURL(500, 500)}
                className=" transition-all duration-[0.3s] ease-in"
              />
            ) : null
          )}
        </div>
        <h3 className="absolute right-2 top-4 my-auto rounded-2xl bg-gray-600 px-4 text-sm font-normal text-white lg:text-lg">
          {props.image ? imageIdx + 1 : 0}/{props.image?.length}
        </h3>
        <Button
          variant={"ghost"}
          className="absolute left-3 top-1/2 rounded-full bg-white px-2.5 opacity-20 hover:opacity-100"
          onClick={onSwitchImageLeft}
        >
          <ChevronLeft
            size={
              xlScreenSize ? 20 : lgScreenSize ? 20 : mdScreenSize ? 18 : 18
            }
            strokeWidth={1.75}
          />
        </Button>
        <Button
          variant={"ghost"}
          className="absolute right-3 top-1/2 rounded-full bg-white px-2.5 opacity-20 hover:opacity-100"
          onClick={onSwitchImageRight}
        >
          <ChevronRight
            size={
              xlScreenSize ? 20 : lgScreenSize ? 20 : mdScreenSize ? 18 : 18
            }
            strokeWidth={1.75}
          />
        </Button>
      </div>
      {/* <-- Product Images --> */}

      {/* <-- Product Desc --> */}
      <div className="col-span-1 flex h-[75vh] flex-col space-x-1 rounded-lg py-2 pr-8">
        <Button variant={"ghost"} className="absolute right-1 top-1 px-2">
          <ArrowUpRightFromCircle
            size={
              xlScreenSize ? 20 : lgScreenSize ? 20 : mdScreenSize ? 18 : 18
            }
            strokeWidth={1.75}
          />
        </Button>

        <div className="relative overflow-scroll [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
          <h3 className="mx-1 font-extrabold leading-tight tracking-tight lg:text-[32px] lg:font-bold">
            {title}
          </h3>
          <h3 className="flex tracking-tight lg:text-xl">
            <p ref={descRef} className="line-clamp-3 text-ellipsis break-all">
              {props.body}
              <span
                className="{{ isLongDesc ? 'hidden' : 'inline' }} mt-auto font-bold hover:cursor-pointer"
                onClick={onLess}
              >
                Less
              </span>
            </p>
            {!isLongDesc ? (
              <span
                className="mt-auto -translate-x-1 font-bold hover:cursor-pointer"
                onClick={onMore}
              >
                More
              </span>
            ) : null}
          </h3>
          <div className="mt-6 flex">
            {props.tags?.map((tag, i) => (
              <h3
                key={i}
                className="mx-2 tracking-tight text-primary lg:text-xl"
              >
                #{tag}
              </h3>
            ))}
          </div>
          {/* <-- Product Desc --> */}

          {/* <-- Brand Section --> */}
          <div className="my-2 flex h-12 w-full">
            <div className="my-auto mr-auto flex">
              <div className="">
                <Link href={props.originalUrl} className="m-auto">
                  <Avatar>
                    <AvatarImage
                      src={
                        props.brandLogo
                          ? props.brandLogo
                          : "/image/bg-decoration.svg"
                      }
                    />
                    <AvatarFallback>{props.brandName}</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
              <div className="mx-2 flex flex-col">
                <h3 className="mt-auto text-sm font-medium tracking-tight lg:text-lg">
                  {props.brandName}
                </h3>
                <h3 className="mb-auto text-sm font-medium tracking-tight lg:text-lg">
                  10,000 followers
                </h3>
              </div>
            </div>
            <Button
              variant={"ghost"}
              className="my-auto ml-auto h-[60%] bg-primary px-4 py-0 text-center text-accent text-white"
            >
              Follow
            </Button>
          </div>
          <div className="m-2 grid h-20 grid-cols-4 gap-2 rounded-lg p-2 shadow-lg">
            <div className="col-span-1 flex">
              <Link href={props.originalUrl} className="m-auto">
                <Image
                  src={props.brandLogo ? props.brandLogo : "/logo.svg"}
                  width={70}
                  height={70}
                  alt={"Brand Logo"}
                  className="object-cover"
                />
              </Link>
            </div>
            <div className="col-span-3 flex h-1/2 flex-col">
              <div className="mb-1 mt-auto grid grid-cols-3">
                <h3 className="col-span-1 mx-auto text-sm font-bold tracking-tight lg:text-lg">
                  {props.brandName}
                </h3>
              </div>
              <div className="mb-auto grid h-1/2 grid-cols-3">
                <Button
                  variant={"ghost"}
                  className="col-span-1 h-auto truncate bg-gradient-to-r from-[#FDA7FF] via-[#5C62ED] to-[#8908B6] text-center text-xs font-bold text-accent text-white underline"
                >
                  <Link href={props.shopUrl}>Go For It</Link>
                </Button>
                <div className="col-span-2 mx-2 text-sm">
                  <h3 className="lg:text-md mt-auto line-clamp-2 text-xs tracking-tight underline">
                    <Link href={props.shopUrl}>{props.shopUrl}</Link>
                  </h3>
                  {/* <h3 className="lg:text-md mt-auto truncate text-xs tracking-tight">
                    {props.body}
                  </h3> */}
                </div>
              </div>
            </div>
          </div>
          {/* <-- Brand Section --> */}

          <Separator className="my-2" />

          {/* <-- Comments --> */}
          <div className="grow">
            <h3 className="my-2 text-sm font-bold tracking-tight lg:text-lg">
              Comments
            </h3>
            <div className="h-auto overflow-auto">
              {comments.map((comment, i) => (
                <Comment key={i} />
              ))}
            </div>
          </div>
          {/* <-- Comments --> */}
        </div>

        <div className="b-0 sticky">
          <div className="flex">
            <div className="mx-0.5 flex">
              <Button variant={"ghost"} className="px-2">
                <Heart size={20} strokeWidth={2} />
              </Button>
              <h3 className="my-auto text-sm lg:text-lg">123</h3>
            </div>
            <div className="mx-0.5 flex">
              <Button variant={"ghost"} className="px-2">
                <MessageCircle size={20} strokeWidth={2} />
              </Button>
              <h3 className="my-auto text-sm lg:text-lg">123</h3>
            </div>
            <div className="mx-0.5 flex">
              <Button variant={"ghost"} className="px-2">
                <Star size={20} strokeWidth={2} />
              </Button>
              <h3 className="my-auto text-sm lg:text-lg">123</h3>
            </div>
          </div>
          <div className="my-4 flex">
            <div className="my-auto">
              <Avatar>
                <AvatarImage src="/image/bg-decoration.svg" />
                <AvatarFallback>???</AvatarFallback>
              </Avatar>
            </div>
            <div className="my-auto grid grow grid-cols-12 rounded-2xl bg-gray-100 px-2">
              <Button variant={"ghost"} className="col-span-1 px-1">
                <Edit3 size={16} strokeWidth={1.5} />
              </Button>
              <Input
                className="col-span-8 border-none p-1 text-sm hover:border-none focus:border-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:ring-offset-transparent"
                placeholder="Add your comments"
              ></Input>
              <Button variant={"ghost"} className="col-span-1 px-1">
                <AtSign size={16} strokeWidth={1.5} />
              </Button>
              <Button variant={"ghost"} className="col-span-1 px-1">
                <ImageIcon size={16} strokeWidth={1.5} />
              </Button>
              <Button variant={"ghost"} className="col-span-1 px-1">
                <SmilePlus size={16} strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailCard;
