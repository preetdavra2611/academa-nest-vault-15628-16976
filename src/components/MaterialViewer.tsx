import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

interface MaterialViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: {
    title: string;
    file_name: string;
    file_url: string;
    file_type: string;
  } | null;
  onDownload: () => void;
}

export const MaterialViewer = ({ open, onOpenChange, material, onDownload }: MaterialViewerProps) => {
  if (!material) return null;

  const isPDF = material.file_type === 'application/pdf' || material.file_name.toLowerCase().endsWith('.pdf');
  const isImage = material.file_type.startsWith('image/');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{material.title}</span>
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={onDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(material.file_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden rounded-lg border bg-muted">
          {isPDF ? (
            <iframe
              src={material.file_url}
              className="w-full h-full"
              title={material.title}
            />
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={material.file_url}
                alt={material.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Preview not available for this file type
                </p>
                <Button onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download to view
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
