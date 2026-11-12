import { ErrorState } from "@/components/ErrorState";

export default function NotFound() {
  return (
    <ErrorState
      title="Страница не найдена"
      description="Такой страницы нет — возможно, ссылка устарела или в адресе опечатка."
    />
  );
}
