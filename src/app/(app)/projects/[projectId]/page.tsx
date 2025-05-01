'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, PlusCircle, FileText, Briefcase, Users, DollarSign, CheckCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
import type { Project, Order } from "@/lib/types";
import { mockProjects } from '../mockProjects';
import { mockOrders, getOrderStatusVariant } from '../../orders/mockOrders';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
    const router = useRouter();
    // Ensure this component is a Client Component (`'use client'`) before using hooks
    const params = useParams<{ projectId: string }>();
    const searchParams = useSearchParams(); // Use useSearchParams hook
    const projectId = params?.projectId;

    const [projectData, setProjectData] = React.useState<Project | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    // Example: Read query parameter for tab management
    const initialTab = searchParams.get('tab') || 'orders'; // Default to 'orders' tab

    React.useEffect(() => {
        if (projectId) {
            const foundProject = mockProjects.find(p => p.id === projectId);
            if (foundProject) {
                setProjectData(foundProject);
            } else {
                toast({
                     title: "Error",
                     description: `Project with ID ${projectId} not found.`,
                     variant: "destructive",
                 });
                 router.replace('/projects');
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            toast({
                 title: "Error",
                 description: "Project ID is missing.",
                 variant: "destructive",
             });
             router.replace('/projects');
        }
    }, [projectId, toast, router]);

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading project...</div>;
    }

    if (!projectData) {
        return <div className="flex min-h-screen items-center justify-center">Project not found or ID missing. Redirecting...</div>;
    }

    const relatedOrders = mockOrders.filter(order => order.projectId === projectId);
    const userRole = "Заказчик";

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
                {userRole === "Заказчик" && (
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

            {/* Sections for related entities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Section - Spanning full width, no outer card */}
                <div className={cn("lg:col-span-2 space-y-4")}>
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-lg font-semibold">Orders</h3>
                        {userRole === "Заказчик" && (
                            <Link href="/orders/new" passHref>
                                <Button size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Create Order
                                </Button>
                            </Link>
                        )}
                    </div>
                     <div className={cn("space-y-4")}> {/* Inner div for spacing */}
                         {relatedOrders.length > 0 ? (
                            relatedOrders.map((order: Order) => (
                                <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow border-none">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold mb-1">{order.name}</CardTitle>
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
                             <Card className="shadow-sm border-none">
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
                <Card className="shadow-sm border-none">
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
