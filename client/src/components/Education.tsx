import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar } from "lucide-react";

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  
}

const educationData: EducationItem[] = [
  {
    degree: "MBA – Marketing & HR",
    institution: "Devi Ahilya Vishwavidyalaya (DAVV)  ",
    year: "2024-2026",
    
  },
  {
    degree: "M.A. Economics ",
    institution: "School of Economics, DAVV",
    year: "2021-2023",

  },
  {
    degree: "B.Sc. Computer Applications",
    institution: "Institute of Professional Studies, DAVV",
    year: "2018-2021",

  },
  
];

export default function Education() {
  return (
    <section id="education" className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-education-title">
            Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic journey spanning economics, computer science, and foundational studies
          </p>
        </div>

        <div className="space-y-6">
          {educationData.map((item, index) => (
            <Card key={index} className="hover-elevate transition-all duration-200" data-testid={`card-education-${index}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2" data-testid={`text-degree-${index}`}>
                        {item.degree}
                      </CardTitle>
                      <p className="text-muted-foreground" data-testid={`text-institution-${index}`}>
                        {item.institution}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span data-testid={`text-year-${index}`}>{item.year}</span>
                    </div>
                    {/* <Badge variant="secondary" className="w-fit ml-auto" data-testid={`badge-grade-${index}`}>
                      {item.grade}
                    </Badge> */}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}