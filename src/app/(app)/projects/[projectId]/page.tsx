// src/app/(app)/projects/[projectId]/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, PlusCircle, FileText, Briefcase, Users, DollarSign, CheckCircle, Clock, Eye } from "lucide-react"; // Added Eye icon
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation'; // Use client-side hooks
import type { Project, Order } from "@/lib/types"; // Import Order type
import { mockProjects } from '../mockProjects';
import { mockOrders, getOrderStatusVariant } from '../../orders/mockOrders'; // Import orders and variant helper
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Import cn for conditional classes

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

export default function ProjectDetailPage() {
    const router = useRouter(); // Use router for potential redirection or navigation
    // Client Component: Use useParams hook
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId; // Get projectId after unwrapping

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
                 router.replace('/projects'); // Redirect if project not found
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            toast({
                 title: "Error",
                 description: "Project ID is missing.",
                 variant: "destructive",
             });
             router.replace('/projects'); // Redirect if ID is missing
        }
    }, [projectId, toast, router]); // Add router to dependency array

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading project...</div>;
    }

    if (!projectData) {
        // Message already shown in useEffect, this is a fallback
        return <div className="flex min-h-screen items-center justify-center">Project not found or ID missing. Redirecting...</div>;
    }

    // Filter orders related to this project
    const relatedOrders = mockOrders.filter(order => order.projectId === projectId);

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
             <Card className="shadow-sm border-none">
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
                {/* Orders Section - Spanning full width */}
                <div className={cn("lg:col-span-2 space-y-4")}> {/* Changed Card to div and applied space-y */}
                    <div className="flex items-center justify-between pb-2"> {/* Replicated CardHeader structure without CardHeader component */}
                        <h3 className="text-lg font-semibold">Orders</h3> {/* Used h3 instead of CardTitle */}
                        {userRole === "Заказчик" && (
                            <Link href="/orders/new" passHref> {/* Link to create new order page */}
                                <Button size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Create Order
                                </Button>
                            </Link>
                        )}
                    </div>
                    <div className={cn("pt-0 space-y-4")}> {/* Replicated CardContent padding (top is 0) and applied space-y */}
                         {relatedOrders.length > 0 ? (
                            relatedOrders.map((order: Order) => (
                                <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow border-none"> {/* Added border-none */}
                                    <CardHeader className="pb-2"> {/* Reduced padding bottom */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold mb-1">{order.name}</CardTitle>
                                                 {/* Removed project link as we are on the project page */}
                                            </div>
                                            <Badge variant={getOrderStatusVariant(order.status)} className="flex-shrink-0">
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{order.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold">
                                                Est. Price: {order.currency} {order.totalCalculatedPrice?.toLocaleString() ?? 'N/A'}
                                            </span>
                                            <Link href={`/orders/${order.id}`} passHref>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </Button>
                                            </Link>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Created: {order.createdAt.toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                             <Card className="shadow-sm border-none"> {/* Optional: Wrap 'not found' message */}
                                <CardContent>
                                    <p className="text-sm text-muted-foreground text-center py-4">No orders created for this project yet.</p>
                                </CardContent>
                             </Card>
                        )}
                    </div>
                </div>

                 {/* Team/Freelancers Section */}
                 <Card className="shadow-sm border-none">
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
                <Card className="shadow-sm border-none"> {/* Adjusted colspan back to default */}
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
                <Card className="lg:col-span-2 shadow-sm border-none">
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
