export default function Page({ params }: { params: { id: string } }) {
  return <div>Game: {params.id}</div>;
}
