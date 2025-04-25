"use client";


import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchCemeteriesInArea } from "@/lib/overpass";
import type { OverpassElement } from "@/lib/overpass";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

export default function Home() {
  const [cemeteries, setCemeteries] = useState<OverpassElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [area, setArea] = useState("London");
  const [selectedCemetery, setSelectedCemetery] = useState<OverpassElement | null>(null);
  const [graves, setGraves] = useState<OverpassElement[]>([]);
  const [gravesLoading, setGravesLoading] = useState(false);
  const [gravesError, setGravesError] = useState<string | null>(null);

  // Fetch graves for a selected cemetery
  // This function is called when a cemetery is clicked
  // It fetches graves within the bounds of the cemetery (if available)
  async function handleCemeteryClick(cemetery: OverpassElement) {
    setSelectedCemetery(cemetery);
    setGraves([]);
    setGravesLoading(true);
    setGravesError(null);
    try {
      // Query for graves within the bounds of the cemetery (if available)
      // For demo, we use the same area as the cemetery name, but ideally use bounding box or relation id
      const data = await fetchCemeteriesInArea(cemetery.tags?.name || area); // Replace with a more precise query if possible
      // Filter for graves (amenity=grave) if available
      const gravesList = Array.isArray(data.elements)
        ? data.elements.filter((el: OverpassElement) => el.tags?.amenity === "grave")
        : [];
      setGraves(gravesList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGravesError(err.message);
      } else {
        setGravesError(String(err));
      }
    } finally {
      setGravesLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchCemeteriesInArea(area)
      .then((data) => {
        setCemeteries(data.elements || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [area]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button variant="default">shadcn Button</Button>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        <div className="w-full max-w-xl mt-8">
          <form
            className="mb-4 flex gap-2"
            onSubmit={e => { e.preventDefault(); setArea(e.currentTarget.area.value); }}
          >
            <input
              name="area"
              type="text"
              defaultValue={area}
              placeholder="Enter area (e.g., London)"
              className="border rounded px-3 py-2 w-64 text-black"
            />
            <Button type="submit">Search</Button>
          </form>
          <h2 className="font-bold mb-2">Cemeteries in {area} (Overpass API Example)</h2>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && (
            <ul className="list-disc pl-5">
              {cemeteries.slice(0, 10).map((item) => (
                <li key={item.id}>
                  <button
                    className="underline text-blue-600 hover:text-blue-800 cursor-pointer bg-transparent border-none p-0"
                    onClick={() => handleCemeteryClick(item)}
                  >
                    {item.tags?.name || "Unnamed cemetery"} (type: {item.type}, id: {item.id})
                  </button>
                </li>
              ))}
              {cemeteries.length === 0 && <li>No cemeteries found.</li>}
            </ul>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      <Dialog open={!!selectedCemetery} onOpenChange={(open) => { if (!open) setSelectedCemetery(null); }}>
        <DialogContent>
          <DialogTitle>
            Graves in {selectedCemetery?.tags?.name || "Unnamed cemetery"}
          </DialogTitle>
          <DialogDescription>
            {gravesLoading && <div>Loading graves...</div>}
            {gravesError && <div className="text-red-500">Error: {gravesError}</div>}
            {!gravesLoading && !gravesError && (
              <ul className="list-disc pl-5">
                {graves.length > 0 ? (
                  graves.map((grave) => (
                    <li key={grave.id}>
                      {grave.tags?.name || `Grave ${grave.id}`}
                    </li>
                  ))
                ) : (
                  <li>No graves found in this cemetery.</li>
                )}
              </ul>
            )}
            <DialogClose asChild>
              <Button className="mt-4">Close</Button>
            </DialogClose>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
