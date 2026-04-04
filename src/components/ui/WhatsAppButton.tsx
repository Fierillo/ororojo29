"use client";

import { MessageCircle } from "lucide-react";
import { WhatsAppButtonProps } from "@/lib/types";

export default function WhatsAppButton({
  message = "Hola! Quiero consultar sobre los productos",
  phone = "5491112345678",
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}