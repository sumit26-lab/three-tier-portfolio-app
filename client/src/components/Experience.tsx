import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, MapPin } from "lucide-react";

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  responsibilities: string[];
  achievements?: string[];
}

const experienceData: ExperienceItem[] = [

  {
    title: "Assistant Professor",
    company: "Indore International Law College",
    location: "Indore (M.P)",
    duration: "January 2024 - Present",
    description: "Leading academic instruction and student development in Economics and Communication.",
    responsibilities: [
      "Designed and delivered engaging curriculum in Economics and Communication",
      "Successfully organized various events, including debates, quizzes, and workshops",
      "Developed programs to enhance students' communication skills",
      "Facilitated activities for students' personal growth and leadership development",
      "Provided guidance and support in academic and professional pursuits"
    ]
  },
  {
    title: "Business Development Manager",
    company: "HIKE EDUCATION PVT. LTD",
    location: "Mumbai (Maharashtra)",
    duration: "June 2023 – August 2023",
    description: "Drove business growth through strategic lead generation and customer relationship management.",
    responsibilities: [
      "Generated leads through efficient utilization of CRM software and public relations",
      "Coordinated with technical team from inquiry to enrollment",
      "Analyzed market trends and customer feedback to adapt sales strategies",
      "Assisted candidates throughout enrollment process with guidance and support",
      "Collaborated across departments to optimize enrollment process"
    ],
    achievements: [
      "Leadership and Motivation",
      "Efficient Coordination", 
      "Dual Leadership Role",
      "Proactive lead generation",
      "Customer Relationship Management",
      "Cross-Departmental Collaboration",
      "Adaptive sales strategies and Industry expertise"
    ]
  },
  {
    title: "Trainer & Admission Counsellor",
    company: "Karate Academy Lakhnadon",
    location: "Lakhnadon",
    duration: "2016-2017",
    description: "Provided training and counseling services to academic students.",
    responsibilities: [
      "Providing Training to Academic Students",
      "Assessed student interests and skills, provided strategic course information",
      "Delivered supportive counselling to students with academic concerns",
      "Collaborated with parents, faculty and social workers for student success",
      "Organized events and seminars"
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-experience-title">
            Work Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional journey across education, business development, and training
          </p>
        </div>

        <div className="space-y-8">
          {experienceData.map((item, index) => (
            <Card key={index} className="hover-elevate transition-all duration-200" data-testid={`card-experience-${index}`}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2" data-testid={`text-job-title-${index}`}>
                        {item.title}
                      </CardTitle>
                      <p className="text-lg font-medium text-primary mb-1" data-testid={`text-company-${index}`}>
                        {item.company}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span data-testid={`text-location-${index}`}>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span data-testid={`text-duration-${index}`}>{item.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-description-${index}`}>
                  {item.description}
                </p>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Key Responsibilities:</h4>
                  <ul className="space-y-2" data-testid={`list-responsibilities-${index}`}>
                    {item.responsibilities.map((responsibility, respIndex) => (
                      <li key={respIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {item.achievements && (
                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">Key Achievements:</h4>
                    <div className="flex flex-wrap gap-2" data-testid={`achievements-${index}`}>
                      {item.achievements.map((achievement, achIndex) => (
                        <Badge key={achIndex} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}