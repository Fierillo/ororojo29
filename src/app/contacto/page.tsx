import MainLayout from "@/components/layout/MainLayout";
import ContactForm from "@/components/forms/ContactForm";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { MapPin, Mail, Phone } from "lucide-react";
import { getAdminData } from "@/lib/data";

export const revalidate = 60;

export default async function ContactoPage() {
  const adminData: any = await getAdminData();
  const whatsappNumber = adminData?.whatsappNumber || "5491112345678";
  const contactEmail = adminData?.contactEmail || "contacto@ororojo29.com";
  const location = adminData?.location || "Buenos Aires, Argentina";
  const schedule = adminData?.schedule || "Lunes a Viernes: 9:00 - 18:00\nSábados: 10:00 - 14:00";
  return (
    <MainLayout>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h1 className="font-display text-5xl text-white mb-6">
                <span className="cobre-text-gradient">Contactanos</span>
              </h1>
              <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                ¿Tenés dudas sobre nuestros productos? ¿Querés hacer un pedido
                especial? Contactanos y te responderemos a la brevedad.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 cobre-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Ubicación</h3>
                    <p className="text-gray-400">{location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 cobre-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400">{contactEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 cobre-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">WhatsApp</h3>
                    <p className="text-gray-400">+{whatsappNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 dark-card rounded-xl border border-dark-border bg-black">
                <h3 className="font-display text-xl text-white mb-4">
                  Horarios de atención
                </h3>
                <p className="text-gray-400 whitespace-pre-line">
                  {schedule}
                </p>
              </div>
            </div>

            <div className="dark-card rounded-xl p-8 border border-dark-border bg-black">
              <h2 className="font-display text-3xl text-white mb-8">
                Envianos un mensaje
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton phone={whatsappNumber} />
    </MainLayout>
  );
}