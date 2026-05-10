import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Conditions Generales de Vente | Xyrelthium',
  description: 'Conditions generales de vente de la boutique Xyrelthium.',
};

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">
            Conditions Generales de Vente
          </h1>

          <div className="space-y-8 text-white/70 text-sm leading-relaxed">
            {/* Article 1 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 1 - Objet
              </h2>
              <p>
                Les presentes conditions generales de vente (CGV) regissent
                l&apos;ensemble des ventes effectuees par la societe Xyrelthium
                via son site internet. Toute commande passee sur le site implique
                l&apos;acceptation sans reserve des presentes CGV par
                l&apos;acheteur.
              </p>
            </section>

            {/* Article 2 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 2 - Produits
              </h2>
              <p>
                Les produits proposes a la vente sont ceux qui figurent sur le
                site au jour de la consultation par l&apos;utilisateur. Les
                photographies illustrant les produits n&apos;entrent pas dans le
                champ contractuel. Xyrelthium se reserve le droit de modifier
                l&apos;assortiment de produits a tout moment.
              </p>
              <p className="mt-2">
                Les informations relatives aux produits (descriptions,
                caracteristiques techniques, disponibilite) sont fournies avec la
                plus grande precision possible. Toutefois, des erreurs ou
                omissions peuvent survenir et ne sauraient engager la
                responsabilite de Xyrelthium.
              </p>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 3 - Prix
              </h2>
              <p>
                Les prix sont indiques en euros toutes taxes comprises (TTC). Ils
                ne comprennent pas les frais de livraison, factures en supplement
                et indiques avant la validation de la commande. Xyrelthium se
                reserve le droit de modifier ses prix a tout moment, etant
                entendu que les produits seront factures au prix en vigueur au
                moment de la validation de la commande.
              </p>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 4 - Commande
              </h2>
              <p>
                L&apos;acheteur passe commande sur le site internet en ajoutant
                les produits souhaites a son panier puis en validant sa commande
                apres avoir accepte les presentes CGV. La validation de la
                commande vaut acceptation des prix et descriptions des produits
                disponibles a la vente.
              </p>
              <p className="mt-2">
                Xyrelthium se reserve le droit de refuser ou d&apos;annuler toute
                commande en cas de litige existant avec l&apos;acheteur, de
                non-paiement d&apos;une commande precedente ou de suspicion de
                fraude.
              </p>
            </section>

            {/* Article 5 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 5 - Paiement
              </h2>
              <p>
                Le paiement est exigible immediatement a la commande. Les
                paiements sont effectues par carte bancaire via la plateforme
                securisee Stripe. Les donnees bancaires de l&apos;acheteur ne
                sont jamais stockees par Xyrelthium.
              </p>
              <p className="mt-2">
                En cas de defaut de paiement, Xyrelthium se reserve le droit de
                suspendre ou d&apos;annuler la commande et la livraison.
              </p>
            </section>

            {/* Article 6 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 6 - Livraison
              </h2>
              <p>
                La livraison est effectuee a l&apos;adresse indiquee par
                l&apos;acheteur lors de sa commande. Les delais de livraison sont
                donnes a titre indicatif et ne constituent pas un engagement
                contractuel. Un retard de livraison ne peut donner lieu a aucune
                penalite ou indemnite, ni motiver l&apos;annulation de la
                commande.
              </p>
              <p className="mt-2">
                Pour les produits numeriques, la livraison s&apos;effectue par
                telechargement immediat apres confirmation du paiement.
              </p>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 7 - Droit de retractation
              </h2>
              <p>
                Conformement aux dispositions legales en vigueur, l&apos;acheteur
                dispose d&apos;un delai de 14 jours a compter de la reception du
                produit pour exercer son droit de retractation sans avoir a
                justifier de motif ni a payer de penalite.
              </p>
              <p className="mt-2">
                Le droit de retractation ne s&apos;applique pas aux produits
                numeriques dont l&apos;execution a commence avec l&apos;accord du
                consommateur, ni aux produits descelles apres livraison.
              </p>
              <p className="mt-2">
                Pour exercer ce droit, l&apos;acheteur doit notifier sa decision
                par email a contact@xyrelthium.com. Les produits doivent etre
                retournes dans leur etat d&apos;origine et complets.
              </p>
            </section>

            {/* Article 8 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 8 - Garanties
              </h2>
              <p>
                Tous les produits vendus sur le site beneficient de la garantie
                legale de conformite (articles L.217-4 et suivants du Code de la
                consommation) et de la garantie contre les vices caches (articles
                1641 et suivants du Code civil).
              </p>
            </section>

            {/* Article 9 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 9 - Responsabilite
              </h2>
              <p>
                Xyrelthium ne saurait etre tenue responsable des dommages
                resultant d&apos;une mauvaise utilisation du produit achete. La
                responsabilite de Xyrelthium est limitee au montant de la
                commande concernee.
              </p>
            </section>

            {/* Article 10 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Article 10 - Droit applicable et litiges
              </h2>
              <p>
                Les presentes CGV sont soumises au droit francais. En cas de
                litige, une solution amiable sera recherchee avant toute action
                judiciaire. A defaut, les tribunaux francais seront seuls
                competents.
              </p>
              <p className="mt-2">
                Conformement aux dispositions du Code de la consommation
                concernant le reglement amiable des litiges, l&apos;acheteur a le
                droit de recourir gratuitement au service de mediation propose
                par Xyrelthium.
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
