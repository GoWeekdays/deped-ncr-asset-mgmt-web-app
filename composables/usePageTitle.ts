export function usePageTitle(title: string) {
  useHead({
    title: `DepEd AMS - ${title}`,
  });
}
