import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface MaterialCardProps {
  material: {
    id: string;
    title: string;
    description?: string;
    category?: { name: string; icon?: string };
    subject?: { name: string; code: string };
    department?: { name: string };
    semester: number;
    file_name: string;
    file_type: string;
    file_url: string;
    downloads_count: number;
    created_at: string;
    tags?: string[];
  };
  onDownload?: (material: any) => void;
}

export const MaterialCard = ({ material, onDownload }: MaterialCardProps) => {
  const getCategoryIcon = () => {
    return <FileText className="h-12 w-12 text-secondary" />;
  };

  return (
    <Card className="hover-lift overflow-hidden group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {material.title}
            </CardTitle>
            {material.description && (
              <CardDescription className="mt-2 line-clamp-2">
                {material.description}
              </CardDescription>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            {getCategoryIcon()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <div className="flex flex-wrap gap-2">
          {material.category && (
            <Badge variant="secondary" className="font-medium">
              {material.category.name}
            </Badge>
          )}
          {material.subject && (
            <Badge variant="outline">
              {material.subject.code}
            </Badge>
          )}
          <Badge variant="outline">
            Sem {material.semester}
          </Badge>
        </div>

        {material.tags && material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {material.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(material.created_at), "MMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {material.downloads_count} downloads
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            if (onDownload) onDownload(material);
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download {material.file_type.toUpperCase()}
        </Button>
      </CardFooter>
    </Card>
  );
};
