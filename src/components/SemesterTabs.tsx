import { Button } from "@/components/ui/button";

interface SemesterTabsProps {
  selectedSemester: number;
  onSelectSemester: (semester: number) => void;
}

export const SemesterTabs = ({ selectedSemester, onSelectSemester }: SemesterTabsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
        <Button
          key={sem}
          onClick={() => onSelectSemester(sem)}
          variant={selectedSemester === sem ? "default" : "outline"}
          className={`h-14 text-base font-medium ${
            selectedSemester === sem ? "shadow-elegant" : ""
          }`}
        >
          Sem {sem}
        </Button>
      ))}
    </div>
  );
};
