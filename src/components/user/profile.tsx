"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import RichTextEditor from "../text-editor";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: true;
  };
}>;

interface ProfileProps {
  user: UserWithProfile;
}

const profileSchema = z.object({
  notes: z.string().min(5, {
    message: "Your notes should be at least 5 characters.",
  }),
});

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const notes = user.profile?.notes ?? "";

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      notes,
    },
  });

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => toast.info("Profile updated successfully."),
    onError: ({ message }) => toast.error(message),
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfile.mutate(values);
  };

  return (
    <div>
      <h1 className="pt-4 text-2xl font-medium">Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <RichTextEditor {...field} />
                </FormControl>
                <FormDescription>
                  Let your secret Santa know a little about your self. You can
                  include likes, dislikes, or even links to gift ideas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
