import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AdminUpload } from "@/components/AdminUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pendingMaterials, setPendingMaterials] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Access Denied",
        description: "Please login to access admin panel",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setUser(profile);
    await fetchPendingMaterials();
    setLoading(false);
  };

  const fetchPendingMaterials = async () => {
    const { data, error } = await supabase
      .from("pending_materials")
      .select(`
        *,
        category:categories(*),
        subject:subjects(*),
        department:departments(*),
        submitter:profiles!pending_materials_submitted_by_fkey(full_name, email)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending materials",
        variant: "destructive",
      });
    } else {
      setPendingMaterials(data || []);
    }

    // Fetch lookup data
    const [subjectsRes, categoriesRes, departmentsRes] = await Promise.all([
      supabase.from("subjects").select("*").order("name"),
      supabase.from("categories").select("*").order("name"),
      supabase.from("departments").select("*").order("name"),
    ]);

    if (subjectsRes.data) setSubjects(subjectsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (departmentsRes.data) setDepartments(departmentsRes.data);
  };

  const handleApprove = async (material: any) => {
    setProcessingId(material.id);
    try {
      // Copy file from pending to approved location
      const oldPath = material.file_url.split("/").pop();
      const newPath = `approved/${oldPath}`;

      // Move file
      const { error: moveError } = await supabase.storage
        .from("materials")
        .move(`pending/${oldPath}`, newPath);

      if (moveError) throw moveError;

      // Get new public URL
      const { data: { publicUrl } } = supabase.storage
        .from("materials")
        .getPublicUrl(newPath);

      // Insert into materials table
      const { error: insertError } = await supabase
        .from("materials")
        .insert({
          title: material.title,
          description: material.description,
          subject_id: material.subject_id,
          category_id: material.category_id,
          department_id: material.department_id,
          semester: material.semester,
          file_url: publicUrl,
          file_name: material.file_name,
          file_type: material.file_type,
          file_size: material.file_size,
          uploaded_by: user.id,
          tags: material.tags,
        });

      if (insertError) throw insertError;

      // Update pending material status
      const { error: updateError } = await supabase
        .from("pending_materials")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", material.id);

      if (updateError) throw updateError;

      toast({
        title: "Material Approved",
        description: "Material has been published successfully",
      });

      await fetchPendingMaterials();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve material",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (material: any) => {
    setProcessingId(material.id);
    try {
      // Delete file from storage
      const filePath = material.file_url.split("/").pop();
      await supabase.storage
        .from("materials")
        .remove([`pending/${filePath}`]);

      // Update pending material status
      const { error } = await supabase
        .from("pending_materials")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", material.id);

      if (error) throw error;

      toast({
        title: "Material Rejected",
        description: "Material has been rejected and removed",
      });

      await fetchPendingMaterials();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject material",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Review and manage submitted materials
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList>
            <TabsTrigger value="upload">Upload Materials</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Review ({pendingMaterials.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <AdminUpload
              subjects={subjects}
              categories={categories}
              departments={departments}
              onUploadSuccess={fetchPendingMaterials}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingMaterials.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">
                    No pending materials to review
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingMaterials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{material.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {material.description || "No description provided"}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{material.category?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Subject</p>
                        <p className="font-medium">{material.subject?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-medium">{material.department?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Semester</p>
                        <p className="font-medium">Semester {material.semester}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Submitted By</p>
                        <p className="font-medium">{material.submitter?.full_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">File Name</p>
                        <p className="font-medium">{material.file_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Submitted On</p>
                        <p className="font-medium">
                          {format(new Date(material.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    {material.tags && material.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {material.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => window.open(material.file_url, "_blank")}
                        variant="outline"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview File
                      </Button>
                      <Button
                        onClick={() => handleApprove(material)}
                        disabled={processingId === material.id}
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        {processingId === material.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReject(material)}
                        disabled={processingId === material.id}
                        variant="destructive"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
