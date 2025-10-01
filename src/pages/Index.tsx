import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SemesterTabs } from "@/components/SemesterTabs";
import { SubjectCard } from "@/components/SubjectCard";
import { MaterialViewer } from "@/components/MaterialViewer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Lightbulb, Users, Clock } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setUser(profile);
        } else {
          setUser(null);
        }
      }
    );

    fetchInitialData();

    return () => subscription.unsubscribe();
  }, []);

  const fetchInitialData = async () => {
    try {
      console.log("Starting to fetch data...");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        setUser(profile);
      }

      const [subjectsRes, materialsRes] = await Promise.all([
        supabase.from("subjects").select("*").order("name"),
        supabase.from("materials").select("*").order("created_at", { ascending: false }),
      ]);

      console.log("Subjects response:", subjectsRes);
      console.log("Materials response:", materialsRes);

      if (subjectsRes.error) {
        console.error("Subjects error:", subjectsRes.error);
        throw subjectsRes.error;
      }
      
      if (materialsRes.error) {
        console.error("Materials error:", materialsRes.error);
        throw materialsRes.error;
      }

      if (subjectsRes.data) {
        console.log("Setting subjects:", subjectsRes.data.length);
        setSubjects(subjectsRes.data);
      }
      
      if (materialsRes.data) {
        console.log("Setting materials:", materialsRes.data.length);
        setMaterials(materialsRes.data);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.semester === selectedSemester &&
      (searchQuery === "" ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSubjectMaterials = (subjectId: string) => {
    return materials.filter((m) => m.subject_id === subjectId);
  };

  const totalMaterials = materials.length;
  const totalDownloads = materials.reduce((sum, m) => sum + (m.downloads_count || 0), 0);

  const handleView = (material: any) => {
    setSelectedMaterial(material);
    setViewerOpen(true);
  };

  const handleDownload = async (material: any) => {
    try {
      // Increment download count
      await supabase
        .from("materials")
        .update({ downloads_count: (material.downloads_count || 0) + 1 })
        .eq("id", material.id);

      // Fetch the file and trigger download
      const response = await fetch(material.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = material.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${material.file_name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFromViewer = () => {
    if (selectedMaterial) {
      handleDownload(selectedMaterial);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <main className="container py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Academic{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Resource Hub
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Browse comprehensive study materials, notes, and past year questions organized by semester for efficient learning.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lightbulb className="h-5 w-5 text-accent" />
              <span>Quality Resources</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span>{totalMaterials}+ Materials</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-secondary" />
              <span>Frequently Updated</span>
            </div>
          </div>

          {/* Semester Tabs */}
          <SemesterTabs
            selectedSemester={selectedSemester}
            onSelectSemester={setSelectedSemester}
          />
        </div>

        {/* Search */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>
          <p className="text-right text-sm text-muted-foreground mt-2">
            Showing {filteredSubjects.length} subjects
          </p>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <Skeleton key={idx} className="h-[400px] rounded-lg" />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No subjects found for this semester.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                materials={getSubjectMaterials(subject.id)}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </main>

      <MaterialViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        material={selectedMaterial}
        onDownload={handleDownloadFromViewer}
      />
    </div>
  );
};

export default Index;
