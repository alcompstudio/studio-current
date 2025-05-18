

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Briefcase, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
// import { mockProjects } from './mockProjects'; // Remove mock data import
import { cn } from "@/lib/utils"; // Import cn for conditional classes
import React, { useEffect, useState } from 'react'; // Added useEffect, useState
import type { Project } from '@/lib/types'; // Assuming Project type exists and is compatible

// Define a more specific type for projects fetched from the API, including customer
interface ProjectWithCustomer extends Project {
  customer?: { // Customer might be optional or could be guaranteed by API include
    id: string | number; // Adjust based on your Customer model
    name: string;
    // other customer fields if needed
  };
  // orders might also be included, define if needed
}

// Helper function to get status badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "In Progress":
      return "default"; // Primary color for active
    case "Completed":
      return "secondary"; // Secondary color for completed
    case "Planning":
      return "outline"; // Outline for planning
    case "On Hold":
      return "destructive"; // Destructive/Reddish for on hold
    default:
      return "secondary";
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
    switch (status) {
        case "In Progress":
            return <Clock className="mr-1 h-3 w-3" />;
        case "Completed":
            return <CheckCircle className="mr-1 h-3 w-3" />;
        case "Planning":
            return <Briefcase className="mr-1 h-3 w-3" />;
        case "On Hold":
             return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />;
        default:
            return null;
    }
};


export default function ProjectsPage() {
  // TODO: Fetch and display projects based on user role
  const userRole = "Заказчик"; // Mock role - replace with actual role check

  const [projects, setProjects] = useState<ProjectWithCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error("Failed to fetch projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col gap-6">
       {/* Page Header */}
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
         {userRole === "Заказчик" && ( // Show button only for Заказчик (Client)
             <Link href="/projects/new" passHref>
                <Button>
                   <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
                </Button>
            </Link>
         )}
       </div>

        {/* Project List Header Info */}
        <div className="mb-2">
            <h3 className="text-lg font-semibold">Project List</h3>
            <p className="text-sm text-muted-foreground">Manage your ongoing and completed projects.</p>
        </div>

       {/* Project List Content - No wrapping Card */}
       <div className="space-y-4">
          {isLoading && (
            <Card className="shadow-sm border-none">
              <CardContent>
                <p className="text-sm text-muted-foreground py-4 text-center">Loading projects...</p>
              </CardContent>
            </Card>
          )}
          {error && (
            <Card className="shadow-sm border-destructive bg-destructive/10">
              <CardContent className="flex items-center gap-2 text-destructive py-4">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-semibold">Error loading projects: {error}</p>
              </CardContent>
            </Card>
          )}
          {!isLoading && !error && projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow border-none"> {/* Removed border */}
                <CardHeader className="pb-2"> {/* Reduce padding bottom */}
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{project.title ?? project.name}</CardTitle>
                    <Badge variant={getStatusVariant(project.status)} className="flex items-center">
                         {getStatusIcon(project.status)}
                         {project.status}
                    </Badge>
                  </div>
                  <CardDescription>Client: {project.customer?.name || 'N/A'} • Budget: {project.currency} {project.budget?.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                   <Link href={`/projects/${project.id}`} passHref>
                     <Button variant="outline" size="sm">View Details</Button>
                   </Link>
                </CardContent>
              </Card>
            ))
          ) : (
             !isLoading && !error && (
                 <Card className="shadow-sm border-none"> {/* Removed border */}
                    <CardContent>
                        <p className="text-sm text-muted-foreground py-4 text-center">No projects created yet.</p>
                    </CardContent>
                </Card>
             )
          )}
        </div>
    </div>
  );
}
