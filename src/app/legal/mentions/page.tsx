import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Mentions Legales | Xyrelthium',
  description: 'Mentions legales du site Xyrelthium.',
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">
            Mentions Legales
          </h1>

          <div className="space-y-8 text-white/70 text-sm leading-relaxed">
            {/* Editeur */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Editeur du site
              </h2>
              <p>
                Le site internet xyrelthium.com est edite par la societe
                Xyrelthium SAS, societe par actions simplifiee au capital de
                10 000 euros.
              </p>
              <ul className="mt-3 space-y-1">
                <li>
                  <span className="text-white/50">Siege social :</span> 42 rue
                  de l&apos;Innovation, 75001 Paris, France
                </li>
                <li>
                  <span className="text-white/50">RCS :</span> Paris B 123 456
                  789
                </li>
                <li>
                  <span className="text-white/50">SIRET :</span> 123 456 789
                  00012
                </li>
                <li>
                  <span className="text-white/50">TVA intracommunautaire :</span>{' '}
                  FR 12 345678901
                </li>
                <li>
                  <span className="text-white/50">Directeur de la publication :</span>{' '}
                  Le representant legal de la societe
                </li>
                <li>
                  <span className="text-white/50">Email :</span>{' '}
                  contact@xyrelthium.com
                </li>
                <li>
                  <span className="text-white/50">Telephone :</span> +33 1 23 45
                  67 89
                </li>
              </ul>
            </section>

            {/* Hebergement */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Hebergement
              </h2>
              <p>Le site est heberge par :</p>
              <ul className="mt-3 space-y-1">
                <li>
                  <span className="text-white/50">Raison sociale :</span> Vercel
                  Inc.
                </li>
                <li>
                  <span className="text-white/50">Adresse :</span> 340 S Lemon
                  Ave #4133, Walnut, CA 91789, USA
                </li>
                <li>
                  <span className="text-white/50">Site web :</span>{' '}
                  https://vercel.com
                </li>
              </ul>
            </section>

            {/* Propriete intellectuelle */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Propriete intellectuelle
              </h2>
              <p>
                L&apos;ensemble des contenus presents sur le site Xyrelthium
                (textes, images, graphismes, logo, icones, sons, logiciels) est
                la propriete exclusive de Xyrelthium SAS ou de ses partenaires et
                est protege par les lois francaises et internationales relatives
                a la propriete intellectuelle.
              </p>
              <p className="mt-2">
                Toute reproduction, representation, modification, publication ou
                adaptation de tout ou partie des elements du site, quel que soit
                le moyen ou le procede utilise, est interdite sauf autorisation
                ecrite prealable de Xyrelthium SAS.
              </p>
            </section>

            {/* Donnees personnelles */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Protection des donnees personnelles
              </h2>
              <p>
                Conformement au Reglement General sur la Protection des Donnees
                (RGPD) et a la loi Informatique et Libertes, vous disposez de
                droits sur vos donnees personnelles. Pour plus d&apos;informations,
                veuillez consulter notre Politique de confidentialite.
              </p>
              <p className="mt-2">
                Pour exercer vos droits (acces, rectification, suppression,
                opposition, portabilite), vous pouvez nous contacter a
                l&apos;adresse : privacy@xyrelthium.com
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Cookies
              </h2>
              <p>
                Le site utilise des cookies necessaires a son fonctionnement
                (session utilisateur, panier d&apos;achat). Ces cookies sont
                essentiels et ne necessitent pas votre consentement prealable.
              </p>
              <p className="mt-2">
                Des cookies analytiques peuvent etre utilises pour mesurer
                l&apos;audience du site. Vous pouvez a tout moment modifier vos
                preferences en matiere de cookies via les parametres de votre
                navigateur.
              </p>
            </section>

            {/* Limitation de responsabilite */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Limitation de responsabilite
              </h2>
              <p>
                Xyrelthium SAS s&apos;efforce d&apos;assurer l&apos;exactitude
                et la mise a jour des informations diffusees sur son site. Elle
                se reserve le droit de corriger le contenu a tout moment et sans
                preavis.
              </p>
              <p className="mt-2">
                Xyrelthium SAS ne peut etre tenue responsable de
                l&apos;utilisation faite des informations et contenus presents
                sur le site. Les liens hypertextes vers d&apos;autres sites ne
                constituent pas une validation de ces sites ou de leur contenu.
              </p>
            </section>

            {/* Credits */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Credits
              </h2>
              <p>
                Conception et developpement : Xyrelthium SAS
              </p>
              <p className="mt-2">
                Les icones utilisees proviennent de la bibliotheque Lucide Icons
                sous licence MIT.
              </p>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Droit applicable
              </h2>
              <p>
                Les presentes mentions legales sont soumises au droit francais.
                En cas de litige et a defaut de resolution amiable, les
                tribunaux francais seront seuls competents pour en connaitre.
              </p>
            </section>

            {/* Last updated */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-white/40">
                Derniere mise a jour : Janvier 2025
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
