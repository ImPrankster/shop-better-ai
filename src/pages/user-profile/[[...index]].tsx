import React, { type Dispatch, type SetStateAction, useState } from "react";

import { useRouter } from "next/router";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next/types";

import { UserProfile } from "@clerk/nextjs";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { Loader2, Undo2 } from "lucide-react";
import superjson from "superjson";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Toggle } from "~/components/ui/toggle";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import {
  type ImageTagOutputArray,
  type TextTagOutputArray,
  api,
} from "~/utils/api";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    // @ts-expect-error this is fine
    ctx: createTRPCContext({ req, res }),
    transformer: superjson,
  });

  const allTextTags = await helpers.userTag.getAllTextTags.fetch();
  const allImageTags = await helpers.userTag.getAllImageTags.fetch();
  const userTextTagInit = await helpers.userTag.getUserTextTag.fetch();
  const userImageTagInit = await helpers.userTag.getUserImageTag.fetch();

  return {
    props: {
      allTextTags,
      allImageTags,
      userTextTagInit,
      userImageTagInit,
    },
  };
};

const UserProfilePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const [userTextTag, setUserTextTag] = useState(props.userTextTagInit);
  const [userImageTag, setUserImageTag] = useState(props.userImageTagInit);
  const submitUserTextTag = api.userTag.setUserTextTag.useMutation();
  const submitUserImageTag = api.userTag.setUserImageTag.useMutation();

  const onSubmit = async () => {
    await submitUserTextTag.mutateAsync(new Set(userTextTag));
    await submitUserImageTag.mutateAsync(new Set(userImageTag));

    await router.push("/home");
  };

  return (
    <main className="min-h-screen bg-secondary py-8 text-primary-foreground">
      <Tabs
        defaultValue="account"
        className="flex w-screen flex-col place-items-center"
      >
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              router.back();
            }}
            variant="ghost"
          >
            <Undo2 className="text-current" />
          </Button>
          <TabsList className="grid max-w-md grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preference">Preference</TabsTrigger>
          </TabsList>
          <div className="w-[56px]"></div>
        </div>

        {/* Account tab */}
        <TabsContent value="account">
          <div className="my-8">
            <UserProfile routing="path" path="/user-profile" />
          </div>
        </TabsContent>

        {/* Preference tab */}
        <TabsContent
          value="preference"
          className="flex flex-col place-items-center self-stretch"
        >
          <Card className="m-4 place-self-stretch rounded-2xl md:w-96 md:place-self-center">
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col place-items-center space-y-2">
              <Label className="text-md text-center font-semibold">
                Text Content preference
              </Label>
              <ListOfToggles
                tags={props.allTextTags}
                init={userTextTag}
                set={setUserTextTag}
              />
              <Label className="text-md text-center font-semibold">
                Image Content preference
              </Label>
              <ListOfToggles
                tags={props.allImageTags}
                init={userImageTag}
                set={setUserImageTag}
              />
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                disabled={
                  submitUserTextTag.isLoading || submitUserImageTag.isLoading
                }
                onClick={() => {
                  onSubmit().catch((e) => console.log(e));
                }}
              >
                {submitUserTextTag.isLoading || submitUserImageTag.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

const ListOfToggles = (props: {
  tags: TextTagOutputArray | ImageTagOutputArray;
  init: string[];
  set: Dispatch<SetStateAction<string[]>>;
}) => {
  return (
    <div className="grid grid-cols-3">
      {props.tags.map((tag, i) => (
        <Toggle
          key={i}
          size="lg"
          className="m-2 flex flex-col"
          defaultPressed={props.init.includes(tag.id)}
          onPressedChange={(value) => {
            props.set((prev) => {
              if (!value) {
                return prev.filter((id) => id !== tag.id);
              } else {
                return [...prev, tag.id];
              }
            });
          }}
        >
          <p>{tag.name}</p>
        </Toggle>
      ))}
    </div>
  );
};

export default UserProfilePage;
