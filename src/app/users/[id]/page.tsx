import { redirect } from "next/navigation";
import { z } from "zod";
import { ReadOnly } from "~/components/text-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getRole } from "~/server/auth";
import { api } from "~/trpc/server";

const UrlSchema = z.object({ id: z.coerce.string() });

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");
  const safeParams = UrlSchema.safeParse(await params);

  if (safeParams.error) {
    return <div>Bad Url</div>;
  }

  const user = await api.user.get({ id: safeParams.data.id });
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        {!!user.group && <CardDescription>{user.group.name}</CardDescription>}
      </CardHeader>
      <CardContent>
        <h2 className="text-xl">Notes</h2>
        <ReadOnly
          value={
            user.profile?.notes ??
            `<p><i>This user has not added any notes yet.</i></p>`
          }
        />
      </CardContent>
    </Card>
  );
};

export default Page;
