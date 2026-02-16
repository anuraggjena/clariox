import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import Editor from "@/components/editor/Editor";
import { useEditorStore } from "@/store/useEditorStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = id ? Number(id) : null;

  const { content, setContent, reset } = useEditorStore();

  const [title, setTitle] = useState("");
  const [statusValue, setStatusValue] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(true);

  // ✅ Reset store when post changes
  useEffect(() => {
    reset();
  }, [postId, reset]);

  // ✅ Fetch post
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/posts/${postId}`);

        setTitle(res.data.title);
        setStatusValue(res.data.status);
        setContent(res.data.content);
      } catch (err) {
        console.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, setContent]);

  // ✅ Auto Save
  const { status, manualSave } = useAutoSave({
    postId,
    title,
    content,
  });

  // ✅ Publish Toggle (corrected)
  const togglePublish = async () => {
    if (!postId) return;

    const newStatus =
      statusValue === "published" ? "draft" : "published";

    try {
      const res = await api.patch(`/api/posts/${postId}`, {
        status: newStatus,
      });

      setStatusValue(res.data.status);
    } catch (err) {
      console.error("Publish toggle failed");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-muted-foreground">
          Loading...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between">

          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4">

            {/* Save Indicator */}
            {status === "saving" && (
              <span className="text-sm text-muted-foreground">
                Saving...
              </span>
            )}

            {status === "saved" && (
              <span className="text-sm text-green-600">
                Saved
              </span>
            )}

            <Button variant="outline" onClick={manualSave}>
              Save
            </Button>

            <Button
              variant={
                statusValue === "published"
                  ? "secondary"
                  : "default"
              }
              onClick={togglePublish}
            >
              {statusValue === "published"
                ? "Unpublish"
                : "Publish"}
            </Button>

          </div>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full text-3xl font-bold outline-none bg-transparent"
        />

        {/* Editor */}
        <Editor />

      </div>
    </AppLayout>
  );
}
