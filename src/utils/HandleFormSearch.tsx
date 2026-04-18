export function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>, onSearch?: (query: string) => void) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const query = formData.get("q") as string;

  if (onSearch) onSearch(query);
}
