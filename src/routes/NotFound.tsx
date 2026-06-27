import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="text-center">
      <p className="text-4xl">🤔</p>
      <h2 className="mt-2 text-xl font-bold">Pagina niet gevonden</h2>
      <Link to="/" className="mt-4 inline-block text-sarnami-600 underline">
        Terug naar het pad
      </Link>
    </div>
  );
}
