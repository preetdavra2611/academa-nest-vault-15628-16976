import { Zap, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FeatureBadges = () => {
  const badges = [
    {
      icon: Zap,
      text: "Instant Access",
      gradient: "from-primary to-primary/80",
    },
    {
      icon: BookOpen,
      text: "All Semesters",
      gradient: "from-secondary to-secondary/80",
    },
    {
      icon: Sparkles,
      text: "Regular Updates",
      gradient: "from-accent to-accent/80",
    },
    {
      icon: TrendingUp,
      text: "Quality Content",
      gradient: "from-primary via-secondary to-accent",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className="group relative"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${badge.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
            />
            <Badge
              variant="secondary"
              className={`relative px-6 py-3 text-base font-medium bg-gradient-to-r ${badge.gradient} text-white border-0 hover-scale cursor-default shadow-elegant animate-fade-in`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {badge.text}
            </Badge>
          </div>
        );
      })}
    </div>
  );
};
