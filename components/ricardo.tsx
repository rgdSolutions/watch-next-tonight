import Link from 'next/link';

export const Ricardo = () => (
  <div className="flex-1 glass-panel border-keyline p-6 sm:p-8 mt-6">
    <h3 className="text-xl font-semibold text-foreground mb-3">Ricardo D&apos;Alessandro</h3>
    <p className="text-muted-foreground mb-4">
      Full-stack developer and entertainment technology enthusiast with over a decade of experience
      building innovative web applications. Passionate about creating tools that simplify
      decision-making and enhance the entertainment experience.
    </p>
    <p className="text-muted-foreground mb-4">
      Watch Next Tonight combines my love for cinema and technology, leveraging modern web
      technologies and AI to solve a problem I face every evening: finding the perfect thing to
      watch without spending 30 minutes browsing.
    </p>
    <div className="flex gap-4 text-sm">
      <Link
        href="https://github.com/rgdSolutions"
        className="text-primary font-medium underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </Link>
      <Link
        href="/contact"
        className="text-primary font-medium underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
      >
        Contact
      </Link>
    </div>
  </div>
);
