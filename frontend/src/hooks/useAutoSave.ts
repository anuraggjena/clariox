import { useEffect, useRef, useState } from "react";
import api from "@/services/api";

interface AutoSaveProps {
  postId: number | null;
  title: string;
  content: any;
}

export function useAutoSave({ postId, title, content }: AutoSaveProps) {
  const timeoutRef = useRef<number | null>(null);
  const isSavingRef = useRef(false);

  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const save = async () => {
    if (!postId) return;
    if (isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      setStatus("saving");

      await api.patch(`/api/posts/${postId}`, {
        title,
        content,
      });

      setStatus("saved");

      // after 1.5s revert to idle
      setTimeout(() => {
        setStatus("idle");
      }, 1500);
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      isSavingRef.current = false;
    }
  };

  useEffect(() => {
    if (!postId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      save();
    }, 1000); // 1s debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content, postId]);

  return { status, manualSave: save };
}
