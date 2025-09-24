import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  FlaskConical, 
  Code, 
  Database, 
  Brain, 
  Zap, 
  Globe, 
  Camera,
  Bot,
  LineChart,
  Lock,
  Wifi,
  Smartphone
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface LabFeature {
  id: string;
  title: string;
  description: string;
  status: "stable" | "beta" | "experimental";
  icon: React.ComponentType<{ className?: string }>;
  category: "ai" | "integration" | "analytics" | "security";
  progress?: number;
}

const LAB_FEATURES: LabFeature[] = [
  {
    id: "ai-assistant",
    title: "AI Teaching Assistant",
    description: "Intelligent chatbot to help students with course questions and provide automated feedback on assignments.",
    status: "beta",
    icon: Bot,
    category: "ai",
    progress: 75
  },
  {
    id: "smart-scheduling",
    title: "Smart Scheduling",
    description: "AI-powered automatic scheduling system that optimizes class times based on student preferences and room availability.",
    status: "experimental",
    icon: Brain,
    category: "ai",
    progress: 45
  },
  {
    id: "face-recognition",
    title: "Face Recognition Attendance",
    description: "Automated attendance tracking using facial recognition technology for contactless check-ins.",
    status: "beta",
    icon: Camera,
    category: "ai",
    progress: 60
  },
  {
    id: "sso-integration",
    title: "Single Sign-On (SSO)",
    description: "Integration with enterprise identity providers including Azure AD, Google Workspace, and SAML providers.",
    status: "stable",
    icon: Lock,
    category: "security",
    progress: 100
  },
  {
    id: "mobile-app",
    title: "Mobile Application",
    description: "Native iOS and Android applications with offline capabilities and push notifications.",
    status: "beta",
    icon: Smartphone,
    category: "integration",
    progress: 80
  },
  {
    id: "learning-analytics",
    title: "Learning Analytics Dashboard",
    description: "Advanced analytics and insights into student learning patterns, engagement metrics, and performance predictions.",
    status: "beta",
    icon: LineChart,
    category: "analytics",
    progress: 70
  },
  {
    id: "api-gateway",
    title: "API Gateway",
    description: "RESTful API with comprehensive documentation for third-party integrations and custom applications.",
    status: "stable",
    icon: Code,
    category: "integration",
    progress: 100
  },
  {
    id: "blockchain-credentials",
    title: "Blockchain Credentials",
    description: "Secure, verifiable digital certificates and credentials using blockchain technology.",
    status: "experimental",
    icon: Database,
    category: "security",
    progress: 30
  },
  {
    id: "iot-integration",
    title: "IoT Campus Integration",
    description: "Smart campus features including automated lighting, temperature control, and occupancy sensors.",
    status: "experimental",
    icon: Wifi,
    category: "integration",
    progress: 25
  },
  {
    id: "virtual-reality",
    title: "VR Learning Environments",
    description: "Immersive virtual reality classrooms and laboratory simulations for enhanced learning experiences.",
    status: "experimental",
    icon: Globe,
    category: "ai",
    progress: 20
  }
];

export function EnhancedLabsPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFeatures = selectedCategory === "all" 
    ? LAB_FEATURES 
    : LAB_FEATURES.filter(feature => feature.category === selectedCategory);

  const getStatusColor = (status: LabFeature["status"]) => {
    switch (status) {
      case "stable": return "success";
      case "beta": return "warning";
      case "experimental": return "destructive";
      default: return "secondary";
    }
  };

  const getCategoryCount = (category: string) => {
    return LAB_FEATURES.filter(feature => feature.category === category).length;
  };

  const handleEnableFeature = (featureId: string) => {
    alert(`Enabling feature: ${featureId}. This would integrate the feature into your campus system.`);
  };

  const handleRequestDemo = (featureId: string) => {
    alert(`Demo requested for: ${featureId}. Our team will contact you to schedule a personalized demonstration.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FlaskConical className="h-6 w-6" />
          Innovation Labs
        </h1>
          <p className="text-muted-foreground">
            Explore cutting-edge features and experimental technologies for the future of education
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {LAB_FEATURES.length} Features Available
        </Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All Features ({LAB_FEATURES.length})</TabsTrigger>
          <TabsTrigger value="ai">AI & ML ({getCategoryCount("ai")})</TabsTrigger>
          <TabsTrigger value="integration">Integration ({getCategoryCount("integration")})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics ({getCategoryCount("analytics")})</TabsTrigger>
          <TabsTrigger value="security">Security ({getCategoryCount("security")})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Stable</span>
                </div>
                <div className="text-2xl font-bold">
                  {LAB_FEATURES.filter(f => f.status === "stable").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">Beta</span>
                </div>
                <div className="text-2xl font-bold">
                  {LAB_FEATURES.filter(f => f.status === "beta").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Experimental</span>
                </div>
                <div className="text-2xl font-bold">
                  {LAB_FEATURES.filter(f => f.status === "experimental").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Avg Progress</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(LAB_FEATURES.reduce((acc, f) => acc + (f.progress || 0), 0) / LAB_FEATURES.length)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge 
                            variant={getStatusColor(feature.status) as any}
                            className="mt-1"
                          >
                            {feature.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {feature.description}
                      </p>
                      
                      {feature.progress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Development Progress</span>
                            <span>{feature.progress}%</span>
                          </div>
                          <Progress value={feature.progress} className="h-2" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      {feature.status === "stable" ? (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEnableFeature(feature.id)}
                        >
                          Enable Feature
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleRequestDemo(feature.id)}
                        >
                          Request Demo
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => alert(`Learn more about ${feature.title}: Detailed documentation and implementation guides would be available here.`)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredFeatures.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No features in this category</h3>
                <p className="text-muted-foreground">
                  Try selecting a different category or view all features.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Have an idea for a new feature?</h3>
          <p className="text-muted-foreground mb-4">
            We're always looking for innovative ways to improve education technology. 
            Share your suggestions with our development team.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => alert("Feature suggestion form would open here, allowing users to submit detailed proposals.")}>
              Suggest a Feature
            </Button>
            <Button 
              variant="outline"
              onClick={() => alert("Partner program information: Learn how to collaborate with us on developing new educational technologies.")}
            >
              Partner Program
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
