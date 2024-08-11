"use client";

import React, { useState } from "react";
import {
  AvatarIcon,
  CheckIcon,
  Cross1Icon,
  Cross2Icon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sleep } from "@/lib/utils";
import { updateProfile } from "@/actions/user";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

type UserInfoCardProps = {
  userInfo: {
    username: string;
    id: string;
  };
};

export default function UserProfileCard({ userInfo }: UserInfoCardProps) {
  const [username, setUsername] = useState(userInfo.username);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveEditHandler = async () => {
    setIsLoading(true);
    toast.loading("Processing...", { id: "update-profile-processing" });

    const result = await updateProfile(username, userInfo.id);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }

    toast.dismiss("update-profile-processing");
    setIsLoading(false);
    setIsEdit(false);
    setUsername(userInfo.username);
  };

  return (
    <Card className="w-[300px] space-y-3 p-5">
      <AvatarIcon className="size-8" />
      <div className="flex items-center justify-between gap-x-2">
        {isEdit ? (
          <Input
            className="w-44"
            value={username}
            disabled={isLoading}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <p className="text-xl font-medium">{userInfo.username}</p>
        )}
        {isEdit ? (
          <div className="flex gap-x-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={isLoading}
              onClick={() => setIsEdit((prev) => !prev)}
            >
              <Cross2Icon className="size-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={isLoading}
              onClick={saveEditHandler}
            >
              <CheckIcon className="size-5" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            <Pencil2Icon />
          </Button>
        )}
      </div>
    </Card>
  );
}
