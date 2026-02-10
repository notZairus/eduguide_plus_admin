import { useAuthContext } from "../contexts/AuthContext";
import { Separator } from "../components/ui/separator";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "../components/ui/card";
import { useHandbookContext } from "../contexts/HandbookContext";
const Dashboard = () => {
  const { auth } = useAuthContext();
  const { handbook } = useHandbookContext();

  return (
    <>
      <section className="p-4 w-full">
        <header>
          <p className="text-2xl">Hello,</p>
          <h2 className="text-4xl font-medium">
            {auth?.firstName}{" "}
            {auth?.middleName.split(" ").length === 1
              ? `${auth.middleName[0]}.`
              : `${auth?.middleName.split(" ")[0][0]}${auth?.middleName.split(" ")[1][0]}.`}{" "}
            {auth?.lastName}
          </h2>
        </header>

        <Separator className="mb-8 mt-4" />

        <div className="grid grid-cols-4 gap-8">
          <Card className="h-40">
            <CardHeader>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-40">
            <CardHeader>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-40">
            <CardHeader>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-40">
            <CardHeader>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-4 gap-8">
          <div
            className="p-4 rounded flex items-center gap-4 min-h-16"
            style={{ backgroundColor: handbook?.color }}
          >
            <div className="min-h-8 h-full w-1.25 bg-background" />
            <p className="font-semibold text-background text-xl">New Topic</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
