import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PDFViewerProps {
  fileName: string;
  fileUrl: string;
}

const PDFViewer = ({ fileName, fileUrl }: PDFViewerProps) => {
  const handleDownload = () => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    // Open the file in a new tab
    window.open(fileUrl, '_blank');
  };

  return (
    <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Uploaded Resume</CardTitle>
              <CardDescription className="text-sm">{fileName}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleView} 
              size="sm" 
              variant="outline"
              className="h-8 px-3"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              onClick={handleDownload} 
              size="sm"
              className="h-8 px-3"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center border border-blue-200/50">
          <FileText className="h-12 w-12 mx-auto text-blue-500" />
          <p className="mt-2 text-sm font-medium text-blue-700">PDF Document</p>
          <p className="text-xs text-blue-600/75 truncate px-4 mt-1">{fileName}</p>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Ready for employers
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;