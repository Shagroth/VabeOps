import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Обработка данных заявки",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-[720px] px-6 py-16 lg:px-10">
          <h1 className="text-2xl font-semibold tracking-tight">Как обрабатываются данные заявки</h1>
          <p className="mt-4 text-sm text-graphite-muted">
            Это короткое, честное описание — не юридический документ на несколько страниц. Пилот
            бесплатный и закрытый, заявки рассматривает один человек (автор), не организация.
          </p>

          <div className="mt-8 flex flex-col gap-6 text-sm">
            <div>
              <h2 className="font-medium text-graphite">Что собираем</h2>
              <p className="mt-1 text-graphite-muted">
                Имя, email, свободный текст об опыте с AI-агентами и о рабочей задаче — именно то,
                что ты вводишь в форму заявки. Ничего больше не собирается автоматически.
              </p>
            </div>
            <div>
              <h2 className="font-medium text-graphite">Зачем</h2>
              <p className="mt-1 text-graphite-muted">
                Только чтобы рассмотреть заявку и решить, пригласить ли тебя в пилотную когорту.
                Данные не передаются третьим лицам и не используются для рекламы или аналитики.
              </p>
            </div>
            <div>
              <h2 className="font-medium text-graphite">Кто видит</h2>
              <p className="mt-1 text-graphite-muted">
                Автор пилота, вручную просматривающий заявки в административном разделе платформы.
              </p>
            </div>
            <div>
              <h2 className="font-medium text-graphite">Сколько хранится</h2>
              <p className="mt-1 text-graphite-muted">
                Пока идёт набор и пилот. Если хочешь, чтобы твою заявку удалили раньше — напиши
                автору напрямую по контакту, который он использовал, когда приглашал тебя.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
