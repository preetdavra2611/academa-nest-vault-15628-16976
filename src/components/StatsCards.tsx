import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, TrendingUp, Users } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalMaterials: number;
    totalDownloads: number;
    recentUploads: number;
    activeUsers?: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Materials",
      value: stats.totalMaterials,
      icon: FileText,
      gradient: "gradient-primary",
    },
    {
      title: "Total Downloads",
      value: stats.totalDownloads,
      icon: Download,
      gradient: "gradient-secondary",
    },
    {
      title: "Recent Uploads",
      value: stats.recentUploads,
      icon: TrendingUp,
      gradient: "gradient-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${card.gradient}`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
