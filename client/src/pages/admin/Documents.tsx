import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, X, Loader2, Send } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  url: string;
  size: number;
  uploaded_at: string;
  status: "processing" | "processed" | "failed";
}



export default function AdminDocuments() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock data for documents
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      // In a real implementation, this would fetch from your backend
      return [
        {
          id: "1",
          name: "company-policy.pdf",
          url: "https://example.com/company-policy.pdf",
          size: 2457600,
          uploaded_at: "2023-06-15T10:30:00Z",
          status: "processed"
        },
        {
          id: "2",
          name: "technical-specs.pdf",
          url: "https://example.com/technical-specs.pdf",
          size: 5242880,
          uploaded_at: "2023-06-10T14:22:00Z",
          status: "processed"
        },
        {
          id: "3",
          name: "project-proposal.pdf",
          url: "https://example.com/project-proposal.pdf",
          size: 1048576,
          uploaded_at: "2023-06-05T09:15:00Z",
          status: "processing"
        }
      ];
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a PDF
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // In a real implementation, you would upload to your backend
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // const response = await fetch('/api/documents/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Add the new document to the list
      queryClient.setQueryData<Document[]>(["documents"], (old = []) => [
        {
          id: Date.now().toString(),
          name: selectedFile.name,
          url: URL.createObjectURL(selectedFile),
          size: selectedFile.size,
          uploaded_at: new Date().toISOString(),
          status: "processing"
        },
        ...old
      ]);
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and is being processed."
      });
      
      // Close dialog after a short delay
      setTimeout(() => {
        setIsUploadDialogOpen(false);
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <AdminLayout 
      title="Document Management" 
      description="Upload and manage PDF documents for the RAG chatbot system"
    >
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Documents</h2>
            <p className="text-sm text-muted-foreground">
              Upload PDF documents to enhance the chatbot's knowledge base
            </p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Manage your PDF documents used by the RAG chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading documents...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No documents uploaded</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by uploading your first PDF document
                </p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>{formatFileSize(document.size)}</TableCell>
                      <TableCell>{formatDate(document.uploaded_at)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            document.status === "processed" ? "default" : 
                            document.status === "processing" ? "secondary" : "destructive"
                          }
                        >
                          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>RAG Chat Interface</CardTitle>
            <CardDescription>
              Ask questions about your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Upload PDF documents to enable the RAG chatbot functionality. The chatbot will appear on the main website once documents are processed.</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a PDF document to be processed and added to the chatbot's knowledge base.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select PDF File</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80">
                      <span>{selectedFile ? selectedFile.name : "Choose a file"}</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isUploading}
                      />
                    </label>
                    {!selectedFile && <p className="pl-1">or drag and drop</p>}
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </div>
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsUploadDialogOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}