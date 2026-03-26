"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type Lenis from "lenis";

interface ModalProps {
  children: ReactNode;
  header?: ReactNode;
}

export function Modal({ children, header }: ModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    // Lenis 스크롤 정지
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    lenis?.stop();

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      // Lenis 스크롤 재시작
      lenis?.start();
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  if (typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-0 h-full w-full max-h-full max-w-full bg-transparent p-0 backdrop:bg-black/60"
      style={{ overscrollBehavior: "contain" }}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <div
          className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* 고정 헤더 영역 */}
          <div className="flex-shrink-0 border-b border-gray-100 p-6 md:p-8 pr-16">
            {header}
          </div>

          {/* 스크롤 가능한 본문 영역 */}
          <div
            className="flex-1 overflow-auto p-6 md:p-8 pt-6"
            style={{ overscrollBehavior: "contain" }}
            data-lenis-prevent
          >
            {children}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </dialog>,
    modalRoot,
  );
}
