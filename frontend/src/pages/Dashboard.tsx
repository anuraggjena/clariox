import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { Post } from "@/types/post";
import AppLayout from "@/components/layout/AppLayout";
import { formatDistanceToNow } from "date-fns";

import {
  Search, 
  FileText, 
  Trash2, 
  Globe, 
  Clock, 
  MoreVertical,
  Loader2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FilePenLine,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FilterType = "all" | "draft" | "published";

const ITEMS_PER_PAGE = 20;

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Search, Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Reset to page 1 whenever user searches or filters
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/posts");
      // Sort posts by updated_at descending (newest first)
      const sortedPosts = res.data.sort((a: Post, b: Post) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const createDraft = async () => {
    const res = await api.post("/api/posts", {
      title: "Untitled Document",
      content: {
        root: {
          type: "root",
          version: 1,
          format: "",
          indent: 0,
          direction: null,
          children: [
            { type: "paragraph", version: 1, format: "", indent: 0, direction: null, children: [] },
          ],
        },
      },
    });
    navigate(`/editor/${res.data.id}`);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/posts/${deleteId}`);
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      
      // Prevent being stuck on an empty page after deletion
      if (paginatedPosts.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Filter & Search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const titleMatches = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           "Untitled Document".toLowerCase().includes(searchQuery.toLowerCase());
      const filterMatches = activeFilter === "all" ? true : post.status === activeFilter;
      return titleMatches && filterMatches;
    });
  }, [posts, searchQuery, activeFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans flex flex-col">
        
        {/* --- TOP NAVIGATION --- */}
        <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Branding */}
            <div className="flex items-center gap-2">
              <div>
                <img src="/logo.svg" alt="ClarioX Logo" className="h-30 w-30" />
              </div>
              
            </div>

            {/* Logout Action */}
            <Button 
              variant="ghost" 
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Log out</span>
            </Button>
          </div>
        </nav>

        {/* --- DASHBOARD --- */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-sans font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                Documents
              </h1>
              <p className="font-sans text-zinc-500 dark:text-zinc-400 text-sm max-w-md leading-relaxed">
                Create, manage, and publish your intelligently assisted writing.
              </p>
            </div>

            <Button 
              onClick={createDraft} 
              className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              <FilePenLine className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
            
            <div className="flex w-full sm:w-auto p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
              {(["all", "draft", "published"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-md capitalize transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80 px-2 sm:px-0 sm:pr-2 pb-2 sm:pb-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Grid Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
              <p className="text-sm font-medium">Loading workspace...</p>
            </div>
          ) : paginatedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/50">
              <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <FileText className="h-8 w-8 text-zinc-400" />
              </div>
              <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                {posts.length === 0 ? "Your workspace is empty" : "No results found"}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
                {posts.length === 0 
                  ? "Start organizing your thoughts and experience the power of structured AI writing."
                  : `We couldn't find any documents matching "${searchQuery}" in ${activeFilter}.`}
              </p>
              {posts.length === 0 && (
                <Button onClick={createDraft} variant="outline" className="h-11 px-6 rounded-xl">
                  Create First Document
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/editor/${post.id}`)}
                    className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer h-48"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        post.status === "published"
                          ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                      }`}>
                        {post.status === "published" ? <Globe className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                        {post.status === "published" ? "Published" : "Draft"}
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem className="text-zinc-600 dark:text-zinc-300">
                              <FilePenLine className="h-4 w-4 mr-2" /> Open
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(post.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <h3 className="font-serif font-medium text-lg text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                      {post.title || "Untitled Document"}
                    </h3>

                    <div className="mt-auto pt-4 flex items-center text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {formatDate(post.updated_at)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 mt-10 pt-6">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-zinc-900 dark:text-zinc-100">{Math.min(currentPage * ITEMS_PER_PAGE, filteredPosts.length)}</span> of <span className="font-medium text-zinc-900 dark:text-zinc-100">{filteredPosts.length}</span> documents
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-9 px-3 rounded-lg border-zinc-200 dark:border-zinc-800"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <div className="text-sm font-medium px-4 text-zinc-900 dark:text-zinc-100">
                      {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 px-3 rounded-lg border-zinc-200 dark:border-zinc-800"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

        </main>

        {/* Delete Dialog remains untouched except for rounded corners */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-xl">Delete Document?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This document will be permanently removed from your workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="rounded-xl h-11">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </AppLayout>
  );
}