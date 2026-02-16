import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import Editor from "@/components/editor/Editor";
import { useEditorStore } from "@/store/useEditorStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import AutoSaveIndicator from "@/components/editor/AutoSaveIndicator";

// Icons
import { ChevronLeft, Globe, Lock, MoreHorizontal, FileText } from "lucide-react";

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = id ? Number(id) : null;

  const { content, setContent, reset } = useEditorStore();
  const [title, setTitle] = useState("");
  const [statusValue, setStatusValue] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reset();
  }, [postId, reset]);

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

  const { manualSave } = useAutoSave({ postId, title, content });

  const togglePublish = async () => {
    if (!postId) return;
    const newStatus = statusValue === "published" ? "draft" : "published";
    try {
      const res = await api.patch(`/api/posts/${postId}`, { status: newStatus });
      setStatusValue(res.data.status);
    } catch (err) {
      console.error("Publish toggle failed");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center text-zinc-500">
          <p className="text-sm font-medium animate-pulse">Opening document...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col font-sans overflow-hidden">
        
        {/* --- MAIN TOP HEADER --- */}
        <header className="flex-none w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between px-4 h-14 z-50">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-8 w-8 text-zinc-500">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
            <div className="flex items-center gap-2 px-2">
              <div className="bg-blue-600 p-1 rounded">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 leading-tight">
                  ClarioX
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Document"
                  className="text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-900 rounded px-1 -ml-1 transition-colors w-48 sm:w-64 truncate leading-tight"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <AutoSaveIndicator />
            <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 hidden sm:block"></div>
            <Button variant="ghost" size="sm" onClick={manualSave} className="h-8 hidden sm:flex">
              Save
            </Button>
            <Button
              size="sm"
              variant={statusValue === "published" ? "outline" : "default"}
              onClick={togglePublish}
              className={`h-8 px-4 rounded-md shadow-none transition-all ${
                statusValue === "published" 
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {statusValue === "published" ? <><Globe className="h-3.5 w-3.5 mr-1.5" /> Published</> : <><Lock className="h-3.5 w-3.5 mr-1.5" /> Publish</>}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* --- EDITOR INJECTION --- */}
        {/* We pass the title down so it can be rendered on the physical "paper" */}
        <div className="flex-1 overflow-hidden">
          <Editor title={title} setTitle={setTitle} />
        </div>

      </div>
    </AppLayout>
  );
}