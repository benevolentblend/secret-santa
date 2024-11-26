"use client";

import { api } from "~/trpc/react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const CreateGameButton: React.FC = () => {
  const [createGameDialogOpen, setCreateGameDialogOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const utils = api.useUtils();
  const createGame = api.game.create.useMutation({
    async onError() {
      toast.error("An error occured when creating the game");
    },
    async onSettled() {
      await utils.game.getAll.invalidate();
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createGame.mutate(values);
    setCreateGameDialogOpen(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `Christmas ${currentYear}`,
    },
  });

  return (
    <Dialog open={createGameDialogOpen} onOpenChange={setCreateGameDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setCreateGameDialogOpen(true)}>
          Create Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Game</DialogTitle>
          <DialogDescription>Create a new Secret Santa Game.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The name of the Game</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameButton;
