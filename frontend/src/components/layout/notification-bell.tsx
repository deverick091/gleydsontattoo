"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bell, Calendar, Clock, FileText, CheckCircle2, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminNotificationService, AdminNotification } from "@/services/admin.service";

function formatRelativeTime(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Agora mesmo";
    if (diffMinutes < 60) return `Há ${diffMinutes} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    if (diffDays === 1) return "Ontem";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  } catch {
    return "";
  }
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carrega IDs já marcados como lidos no localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("read_notification_ids");
      if (stored) {
        setReadIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await adminNotificationService.getNotifications();
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch {
      // Silencioso em caso de erro na checagem periódica
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Polling a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);

    // Atualiza ao focar na janela
    const handleFocus = () => loadNotifications();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadNotifications]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const unreadItems = notifications.filter(n => !readIds.has(n.id));
  const unreadCount = unreadItems.length;

  function markAllAsRead() {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(Array.from(allIds)));
    } catch {
      // ignore
    }
  }

  function handleNotificationClick(item: AdminNotification) {
    const nextRead = new Set(readIds);
    nextRead.add(item.id);
    setReadIds(nextRead);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(Array.from(nextRead)));
    } catch {
      // ignore
    }
    setOpen(false);
    router.push(item.link);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Notificações"
        className="relative p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-accent text-[10px] font-extrabold text-black shadow-md animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/80 bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm">Notificações</h3>
              {unreadCount > 0 && (
                <span className="bg-accent/20 text-accent text-xs font-medium px-2 py-0.5 rounded-full border border-accent/30">
                  {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Marcar lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-900">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-zinc-600 opacity-60" />
                <p className="text-sm font-medium text-zinc-400">Nenhuma notificação</p>
                <p className="text-xs text-zinc-500 mt-1">Tudo está em dia no seu estúdio!</p>
              </div>
            ) : (
              notifications.map((item) => {
                const isRead = readIds.has(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 hover:bg-zinc-900/70 ${
                      !isRead ? "bg-zinc-900/40" : "opacity-75"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        item.type === "budget"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : item.type === "today"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {item.type === "budget" && <FileText className="w-4 h-4" />}
                      {item.type === "today" && <Clock className="w-4 h-4" />}
                      {item.type === "appointment" && <Calendar className="w-4 h-4" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold truncate ${!isRead ? "text-white" : "text-zinc-300"}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-zinc-500 shrink-0">
                          {formatRelativeTime(item.date)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      {item.detail && (
                        <p className="text-[11px] text-zinc-500 mt-1 italic truncate">
                          {item.detail}
                        </p>
                      )}
                    </div>

                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => { setOpen(false); router.push("/admin/agendamentos"); }}
              className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              Agendamentos
            </button>
            <span className="text-zinc-700">•</span>
            <button
              type="button"
              onClick={() => { setOpen(false); router.push("/admin/orcamentos"); }}
              className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              Orçamentos
            </button>
            <span className="text-zinc-700">•</span>
            <button
              type="button"
              onClick={() => { setOpen(false); router.push("/admin/calendario"); }}
              className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              Calendário
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

