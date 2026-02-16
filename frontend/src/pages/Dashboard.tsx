import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import type { Post } from "@/types/post";
import AppLayout from "@/components/layout/AppLayout";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const createDraft = async () => {
    const res = await api.post("/api/posts", {
      title: "Untitled",
      content: {
        root: {
          type: "root",
          version: 1,
          format: "",
          indent: 0,
          direction: null,
          children: [
            {
              type: "paragraph",
              version: 1,
              format: "",
              indent: 0,
              direction: null,
              children: [],
            },
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
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clariox AI</h1>
            <p className="text-muted-foreground">
              Your intelligent writing workspace
            </p>
          </div>

          <Button onClick={createDraft}>
            New Draft
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-muted-foreground">Loading drafts...</p>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <Card className="text-center py-16">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">
                No drafts yet
              </h2>
              <p className="text-muted-foreground">
                Start writing your first intelligent blog.
              </p>
              <Button onClick={createDraft}>
                Create Your First Draft
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Draft List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              onClick={() => navigate(`/editor/${post.id}`)}
              className="hover:shadow-md transition cursor-pointer"
            >
              <CardHeader>
                <CardTitle>
                  {post.title || "Untitled"}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    Updated: {new Date(post.updated_at).toLocaleString()}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded w-fit ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(post.id);
                  }}
                >
                  Delete
                </Button>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delete Dialog */}
        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Permanently delete this blog?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
                Your blog will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </AppLayout>
  );
}
