import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Brain, Users, Target } from "lucide-react";

interface SkillCategory {
  title: string;
  icon: any;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Professional Skills",
    icon: Brain,
    skills: [
      "Planning and Coordination",
      "Analytical and Critical Thinking", 
      "Multitasking and Team Building",
      "Interpersonal Communication"
    ]
  },
  {
    title: "Leadership",
    icon: Users,
    skills: [
      "Team Leadership",
      "Work Pressure Management",
      "Student Mentorship",
      "Event Organization"
    ]
  },
  {
    title: "Certifications",
    icon: Award,
    skills: [
      "International Conference (Economic Growth & Entrepreneurship)",
      "International Conference (Gender Justice)",
      "Mastering Big Data Analytics",
      "Introduction to Digital Marketing",
      "Marketing Analytics and Retail Business Management",
      "Kona Kona Shiksha (NISM Certified)"
    ]
  },
  {
    title: "Achievements",
    icon: Target,
    skills: [
      "National Player in Karate",
      "State Player in Boxing", 
      "Certified Karate Coach (Govt of India)",
      "Placement Coordinator"
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-skills-title">
            Skills & Achievements
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional competencies and notable accomplishments across education, sports, and business
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <Card key={index} className="hover-elevate transition-all duration-200" data-testid={`card-skill-category-${index}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl" data-testid={`text-category-title-${index}`}>
                    {category.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2" data-testid={`skills-list-${index}`}>
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary" 
                      className="text-xs leading-relaxed"
                      data-testid={`skill-badge-${index}-${skillIndex}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}