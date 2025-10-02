import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

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

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    setPreviewError(null);
    if (!open || !material || (!isPDF && !isImage)) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    let canceled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoadingPreview(true);
        const res = await fetch(material.file_url, { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error(`Preview fetch failed: ${res.status}`);
        const blob = await res.blob();
        if (canceled) return;
        const url = URL.createObjectURL(blob);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(url);
      } catch (e: any) {
        if (canceled) return;
        setPreviewError(e?.message || 'Unable to load preview');
        setPreviewUrl(null);
      } finally {
        if (!canceled) setLoadingPreview(false);
      }
    };

    load();

    return () => {
      canceled = true;
      controller.abort();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [open, material?.file_url, material?.file_type, material?.file_name]);

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
          {(isPDF || isImage) ? (
            loadingPreview ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading preview…</p>
              </div>
            ) : previewError ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Preview unavailable. {previewError}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={onDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to view
                    </Button>
                    <Button variant="outline" onClick={() => window.open(material.file_url, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            ) : isPDF ? (
              <iframe
                src={previewUrl ?? material.file_url}
                className="w-full h-full"
                title={material.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={previewUrl ?? material.file_url}
                  alt={material.title}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            )
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
