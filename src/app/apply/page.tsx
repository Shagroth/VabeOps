import { ApplyForm } from "@/components/ApplyForm";

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-md flex-1 p-8">
      <h1 className="mb-2 text-2xl font-semibold">Заявка на пилот</h1>
      <p className="mb-6 text-sm text-black/60">
        Работай с AI-агентами. Думай как инженер. Бесплатный пилот для разработчиков — 5–10 мест.
      </p>
      <ApplyForm />
    </main>
  );
}
