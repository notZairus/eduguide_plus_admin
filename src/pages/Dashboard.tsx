import { useAuthContext } from "../contexts/AuthContext";
import { Separator } from "../components/ui/separator";
import { Card, CardContent } from "../components/ui/card";
import { useHandbookContext } from "../contexts/HandbookContext";
import AddTopicDialog from "../components/AddTopicDialog";
import { Button } from "../components/ui/button";
import AddSectionDialog from "../components/AddSectionDialog";
import AddQuestionDialog from "../components/AddQuestionDialog";
import { BookOpen, Layers, HelpCircle, Check, Copy } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const { auth } = useAuthContext();
  const { handbook, topics } = useHandbookContext();
  const [copied, setCopied] = useState(false);

  const totalTopics = topics.length;
  const totalSections = topics.reduce(
    (acc, topic) => acc + (topic.sections?.length ?? 0),
    0,
  );
  const totalQuestions = topics.reduce(
    (acc, topic) => acc + (topic.active_quiz?.questions?.length ?? 0),
    0,
  );

  const getName = () => {
    if (!auth) return "";
    const mi = auth.middleName
      ? auth.middleName.split(" ").length === 1
        ? `${auth.middleName[0]}.`
        : `${auth.middleName.split(" ")[0][0]}${auth.middleName.split(" ")[1][0]}.`
      : "";
    return `${auth.firstName} ${mi} ${auth.lastName}`;
  };

  const stats = [
    {
      label: "Total Topics",
      value: totalTopics,
      icon: BookOpen,
      description: "Topics in your handbook",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Total Sections",
      value: totalSections,
      icon: Layers,
      description: "Sections across all topics",
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "Total Questions",
      value: totalQuestions,
      icon: HelpCircle,
      description: "Questions in active quizzes",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(handbook!.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="p-6 w-full space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h2 className="text-4xl font-semibold tracking-tight">{getName()}</h2>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <p>Handbook Code:</p>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="font-mono">{handbook?.code}</span>
            </button>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <Separator />

      {/* Stats */}
      <div>
        <h3 className="text-lg font-medium mb-4">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, description, color, bg }) => (
            <Card key={label} className="border shadow-sm">
              <CardContent className="pt-6 pb-5 px-6 flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${bg} shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold leading-none">{value}</p>
                  <p className="text-sm font-medium mt-1">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <AddTopicDialog>
            <Button variant="outline" size="lg" className="gap-2 rounded-lg">
              <BookOpen className="w-4 h-4 text-blue-500" />
              New Topic
            </Button>
          </AddTopicDialog>

          <AddSectionDialog forDashboard={true}>
            <Button variant="outline" size="lg" className="gap-2 rounded-lg">
              <Layers className="w-4 h-4 text-violet-500" />
              New Section
            </Button>
          </AddSectionDialog>

          <AddQuestionDialog forDashboard={true}>
            <Button variant="outline" size="lg" className="gap-2 rounded-lg">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              New Question
            </Button>
          </AddQuestionDialog>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
