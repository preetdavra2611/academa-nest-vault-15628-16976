import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  file_type: string;
  downloads_count: number;
  created_at: string;
  material_type: "material" | "pyq";
}

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    code: string;
  };
  materials: Material[];
  onView: (material: Material) => void;
  onDownload: (material: Material) => void;
}

export const SubjectCard = ({ subject, materials, onView, onDownload }: SubjectCardProps) => {
  const regularMaterials = materials.filter((m) => m.material_type === "material");
  const pyqs = materials.filter((m) => m.material_type === "pyq");

  return (
    <Card className="overflow-hidden bg-gradient-card border-border hover:border-primary/50 transition-all shadow-card">
      <div className="p-6">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-2">
            {subject.code}
          </Badge>
          <h3 className="text-xl font-bold text-foreground">{subject.name}</h3>
        </div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="materials">
              Materials ({regularMaterials.length})
            </TabsTrigger>
            <TabsTrigger value="pyqs">PYQs ({pyqs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-3 max-h-80 overflow-y-auto">
            {regularMaterials.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No materials available yet
              </p>
            ) : (
              regularMaterials.map((material) => (
                <MaterialItem
                  key={material.id}
                  material={material}
                  onView={onView}
                  onDownload={onDownload}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="pyqs" className="space-y-3 max-h-80 overflow-y-auto">
            {pyqs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No PYQs available yet
              </p>
            ) : (
              pyqs.map((material) => (
                <MaterialItem
                  key={material.id}
                  material={material}
                  onView={onView}
                  onDownload={onDownload}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

const MaterialItem = ({
  material,
  onView,
  onDownload,
}: {
  material: Material;
  onView: (material: Material) => void;
  onDownload: (material: Material) => void;
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <FileText className="h-5 w-5 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {material.title}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {material.downloads_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(material.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 ml-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(material)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => onDownload(material)}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
