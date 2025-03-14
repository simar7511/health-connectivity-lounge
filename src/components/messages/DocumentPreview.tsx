
import React from "react";
import { X, Download, FileText, FileImage, Pill, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Attachment {
  id: string;
  name: string;
  type: 'lab_result' | 'prescription' | 'image' | 'document';
  preview?: string;
  date: Date;
  size?: number;
  url?: string;
}

interface DocumentPreviewProps {
  attachments: Attachment[];
  onClose: () => void;
  language?: "en" | "es";
}

const translations = {
  en: {
    title: "Attachments",
    download: "Download",
    noPreview: "No preview available",
    close: "Close",
    date: "Date",
    type: {
      lab_result: "Lab Result",
      prescription: "Prescription",
      image: "Image",
      document: "Document"
    }
  },
  es: {
    title: "Archivos Adjuntos",
    download: "Descargar",
    noPreview: "Vista previa no disponible",
    close: "Cerrar",
    date: "Fecha",
    type: {
      lab_result: "Resultado de Laboratorio",
      prescription: "Receta Médica",
      image: "Imagen",
      document: "Documento"
    }
  }
};

const typeIcons = {
  lab_result: <FileText className="h-4 w-4" />,
  prescription: <Pill className="h-4 w-4" />,
  image: <FileImage className="h-4 w-4" />,
  document: <File className="h-4 w-4" />
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  attachments,
  onClose,
  language = "en"
}) => {
  const t = translations[language];
  const [selectedAttachment, setSelectedAttachment] = React.useState<Attachment | null>(
    attachments.length > 0 ? attachments[0] : null
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleDownload = (attachment: Attachment) => {
    // In a real app, this would trigger a download
    // For now, we'll just show a toast or log
    console.log(`Downloading attachment: ${attachment.name}`);
    alert(`Download started for ${attachment.name}`);
  };

  return (
    <Card className="flex flex-col h-full border-l">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{t.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {attachments.length > 0 ? (
        <>
          <div className="px-4 space-y-2 mb-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={`
                  p-2 rounded-md cursor-pointer flex items-center gap-2
                  ${selectedAttachment?.id === attachment.id ? 'bg-accent' : 'hover:bg-muted'}
                `}
                onClick={() => setSelectedAttachment(attachment)}
              >
                <div className="p-1 bg-primary/10 rounded">
                  {typeIcons[attachment.type] || <FileText className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(attachment.date)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <ScrollArea className="flex-1">
            {selectedAttachment && (
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {typeIcons[selectedAttachment.type]}
                    {t.type[selectedAttachment.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {t.date}: {formatDate(selectedAttachment.date)}
                  </span>
                </div>
                
                {selectedAttachment.preview ? (
                  <div className="p-3 bg-muted rounded-md whitespace-pre-line text-sm">
                    {selectedAttachment.preview}
                  </div>
                ) : (
                  <div className="p-4 bg-muted rounded-md text-center text-sm text-muted-foreground">
                    {t.noPreview}
                  </div>
                )}
              </CardContent>
            )}
          </ScrollArea>
          
          <CardFooter className="p-3 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => selectedAttachment && handleDownload(selectedAttachment)}
              disabled={!selectedAttachment}
            >
              <Download className="h-4 w-4" />
              {t.download}
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-4">
          <FileText className="h-12 w-12 text-muted-foreground mb-2" />
          <CardDescription>No attachments</CardDescription>
        </CardContent>
      )}
    </Card>
  );
};
