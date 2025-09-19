import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp } from "lucide-react";

interface Project {
  title: string;
  description: string;
  type: string;
  icon: any;
}

const projectsData: Project[] = [
  {
    title: "Food Inflation in India, Causes and Cures",
    description: "Comprehensive research analyzing the factors contributing to food inflation in India and proposing sustainable solutions to address this critical economic challenge.",
    type: "Economic Research",
    icon: TrendingUp
  },
  {
    title: "Impact of Ukraine War on Food Inflation",
    description: "In-depth analysis examining how the geopolitical conflict in Ukraine has affected global food supply chains and contributed to inflationary pressures worldwide.",
    type: "Global Economics",
    icon: FileText
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-projects-title">
            Research Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic research focusing on economic analysis and contemporary global issues
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projectsData.map((project, index) => (
            <Card key={index} className="hover-elevate transition-all duration-200 h-full" data-testid={`card-project-${index}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <project.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-3" data-testid={`badge-project-type-${index}`}>
                      {project.type}
                    </Badge>
                    <CardTitle className="text-xl leading-tight" data-testid={`text-project-title-${index}`}>
                      {project.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-project-description-${index}`}>
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}