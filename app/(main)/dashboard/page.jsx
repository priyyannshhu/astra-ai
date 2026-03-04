"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  ArrowRight,
  Clock,
  Folder,
  Archive,
  Trash2,
  Share2,
  MoreVertical,
  Filter,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { userDetail, isLoadingUser } = useContext(UserDetailContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch user's projects
  const projects = useQuery(
    api.projects.GetUserProjects,
    userDetail?._id
      ? { userId: userDetail._id, status: filterStatus === "all" ? "all" : filterStatus }
      : "skip"
  );

  // Fetch workspaces as well
  const workspaces = useQuery(
    api.workspace.GetAllWorkspace,
    userDetail?._id ? { userId: userDetail._id } : "skip"
  );

  useEffect(() => {
    if (!isLoadingUser && !userDetail) {
      router.push("/");
    }
  }, [userDetail, isLoadingUser, router]);

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter and sort projects
  let filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Apply sorting
  if (sortBy === "recent") {
    filteredProjects = [...filteredProjects].sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortBy === "accessed") {
    filteredProjects = [...filteredProjects].sort((a, b) => (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0));
  } else if (sortBy === "name") {
    filteredProjects = [...filteredProjects].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 mt-1">Manage your projects and workspaces</p>
            </div>
            <Button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={18} />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <div className="flex-1 relative min-w-[200px]">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="accessed">Last Accessed</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Projects ({filteredProjects.length})
            </h2>
            {filteredProjects.length > 0 && (
              <span className="text-sm text-slate-400">
                Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
              <Folder size={48} className="mx-auto mb-4 text-slate-500" />
              <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
              <p className="text-slate-400 mb-6">
                Create your first project to get started
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Workspaces Section */}
        {workspaces && workspaces.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Recent Workspaces ({workspaces.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.slice(0, 6).map((workspace) => (
                <WorkspaceCard key={workspace._id} workspace={workspace} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ProjectCard({ project }) {
  const router = useRouter();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors group">
      {/* Thumbnail placeholder */}
      <div className="w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
        <Folder size={32} className="text-white opacity-50" />
      </div>

      <h3 className="font-semibold text-white mb-2 line-clamp-1">{project.name}</h3>
      {project.description && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-block text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="inline-block text-xs text-slate-400">
              +{project.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock size={14} />
          {new Date(project.lastAccessedAt || project.createdAt).toLocaleDateString()}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="text-blue-400 hover:text-blue-300"
          onClick={() => router.push(`/workspace/${project._id}`)}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function WorkspaceCard({ workspace }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/workspace/${workspace._id}`)}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all cursor-pointer hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-white">
          {workspace.title || "Untitled Workspace"}
        </h3>
        <button className="text-slate-400 hover:text-white">
          <MoreVertical size={18} />
        </button>
      </div>

      {workspace.description && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{workspace.description}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <span className="text-xs text-slate-400">
          {workspace.messages?.length || 0} messages
        </span>
        <ArrowRight size={16} className="text-slate-400" />
      </div>
    </div>
  );
}
