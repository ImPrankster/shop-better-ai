import { Heart, MessageCircle } from "lucide-react";

import useMediaQuery from "~/utils/useMediaQuery";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Comment = () => {
  const mdScreenSize = useMediaQuery("(min-width: 768px)");
  const lgScreenSize = useMediaQuery("(min-width: 1024px)");
  const xlScreenSize = useMediaQuery("(min-width: 1900px)");

  return (
    <>
      <div className="m-2 grid h-auto grid-cols-9">
        <div className="col-span-1 flex">
          <Avatar>
            <AvatarImage src="/image/bg-decoration.svg" />
            <AvatarFallback>???</AvatarFallback>
          </Avatar>
        </div>
        <div className="col-span-6 flex h-1/2 flex-col">
          <h3 className="mb-1 mt-auto text-xs tracking-tight lg:text-lg">
            Alpha Park
          </h3>
          <div className="mb-auto grid h-1/2">
            <h3 className="felx-wrap mt-auto text-xs tracking-tight lg:text-base">
              This product is a must-have for any serious user. With its
              ergonomic design, adjustable features, and comfortable materials,
              its the perfect choice for anyone looking to take their experience
              to the next level!
            </h3>
          </div>
        </div>
        <div className="col-span-2 flex flex-row-reverse">
          <div className="flex">
            <Button variant={"ghost"} className="mb-auto px-1">
              <Heart
                size={
                  xlScreenSize ? 14 : lgScreenSize ? 14 : mdScreenSize ? 10 : 10
                }
                strokeWidth={2}
              />
            </Button>
            <h3 className="lg:text-md mb-auto mt-3 text-xs">123</h3>
          </div>
          <div className="flex">
            <Button variant={"ghost"} className="mb-auto px-1">
              <MessageCircle
                size={
                  xlScreenSize ? 14 : lgScreenSize ? 14 : mdScreenSize ? 10 : 10
                }
                strokeWidth={2}
              />
            </Button>
            <h3 className="lg:text-md mb-auto mt-3 text-xs">123</h3>
          </div>
        </div>
      </div>

      <Separator className="my-4" />
    </>
  );
};

export default Comment;
