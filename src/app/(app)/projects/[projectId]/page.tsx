// src/app/(app)/projects/[projectId]/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, PlusCircle, FileText, Briefcase, Users, DollarSign, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import type { Project } from "@/lib/types";
import { mockProjects } from '../mockProjects';
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Helper function to get status badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "In Progress": return "default";
    case "Completed": return "secondary";
    case "Planning": return "outline";
    case "On Hold": return "destructive";
    default: return "secondary";
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
    switch (status) {
        case "In Progress": return <Clock className="mr-1 h-3 w-3" />;
        case "Completed": return <CheckCircle className="mr-1 h-3 w-3" />;
        case "Planning": return <Briefcase className="mr-1 h-3 w-3" />;
        case "On Hold": return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />;
        default: return null;
    }
};

// No need for ProjectDetailPageProps definition in Client Component using hooks

export default function ProjectDetailPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId; // Get projectId directly from hook

    // Need state to re-render when mock data changes (after edit)
    const [projectData, setProjectData] = React.useState<Project | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        if (projectId) {
            // Simulate fetching data
            const foundProject = mockProjects.find(p => p.id === projectId);
            if (foundProject) {
                setProjectData(foundProject);
            } else {
                toast({
                     title: "Error",
                     description: `Project with ID ${projectId} not found.`,
                     variant: "destructive",
                 });
                // Optionally redirect or show not found message
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            toast({
                 title: "Error",
                 description: "Project ID is missing.",
                 variant: "destructive",
             });
        }
    }, [projectId, toast]); // Re-run if projectId changes

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading project...</div>;
    }

    if (!projectData) {
        return <div className="flex min-h-screen items-center justify-center">Project not found or ID missing.</div>; // Or a proper 404 component
    }

    // Mock user role for conditional rendering
    const userRole = "Заказчик"; // Replace with actual role check

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Link href="/projects" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">{projectData.name}</h2>
                     <Badge variant={getStatusVariant(projectData.status)} className="flex items-center text-sm">
                         {getStatusIcon(projectData.status)}
                         {projectData.status}
                    </Badge>
                </div>
                {userRole === "Заказчик" && ( // Show edit button for Client
                    <Link href={`/projects/${projectId}/edit`} passHref>
                         <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Project
                         </Button>
                    </Link>
                )}
            </div>

            {/* Project Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>{projectData.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Client</p>
                        <p>{projectData.clientName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Budget</p>
                        <p>{projectData.currency} {projectData.budget?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Created</p>
                        <p>{projectData.createdAt?.toLocaleDateString() || 'N/A'}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                        <p>{projectData.updatedAt?.toLocaleDateString() || 'N/A'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Sections for related entities (Orders, Bids, etc.) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Orders</CardTitle>
                        {userRole === "Заказчик" && (
                             <Button size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Order
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">No orders created for this project yet.</p>
                         {/* TODO: List orders related to this project */}
                    </CardContent>
                </Card>

                 {/* Team/Freelancers Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Team</CardTitle>
                        {/* Button to add/manage team? */}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">No freelancers assigned to this project yet.</p>
                        {/* TODO: List freelancers associated with the project */}
                    </CardContent>
                </Card>

                {/* Work Assignments Section */}
                <Card className="lg:col-span-2">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Work Assignments</CardTitle>
                         {userRole === "Заказчик" && (
                            <Button size="sm" variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
                            </Button>
                         )}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">No work assignments created yet.</p>
                         {/* TODO: List work assignments related to this project */}
                    </CardContent>
                </Card>

                {/* Finance Summary Section */}
                <Card className="lg:col-span-2">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Finance Summary</CardTitle>
                        <Link href="/finance" passHref>
                             <Button size="sm" variant="link">View Full Finance</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Financial summary for this project will be displayed here.</p>
                         {/* TODO: Display project-specific financial overview (spent, remaining budget, etc.) */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
