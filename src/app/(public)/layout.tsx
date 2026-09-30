import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <SiteHeader />
      <main id="contenu-principal" className="ios-ui flex-1 bg-ms-cream-deep" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
