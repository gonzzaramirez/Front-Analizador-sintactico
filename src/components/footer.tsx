import { Github } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center gap-2 py-3 border-t text-[11px] text-muted-foreground bg-background fixed bottom-0">
      <a
        href="https://github.com/gonzzaramirez/Front-Analizador-sintactico"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="hover:text-primary transition-colors"
      >
        <Github className="size-4" />
      </a>
      <span>
        Desarrollado por Ramirez Gonzalo, Rodrigo Gonzalez, Franco Zini y
        Navarros Milagros
      </span>
      <Image
        src="/unne.png"
        alt="Logo UNNE"
        width={100}
        height={100}
        className="size-5 object-contain"
        priority
      />
    </footer>
  );
}
