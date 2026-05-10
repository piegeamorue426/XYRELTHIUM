import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Politique de Confidentialite | Xyrelthium',
  description: 'Politique de confidentialite et protection des donnees personnelles de Xyrelthium.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">
            Politique de Confidentialite
          </h1>

          <div className="space-y-8 text-white/70 text-sm leading-relaxed">
            {/* Introduction */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Introduction
              </h2>
              <p>
                La societe Xyrelthium SAS accorde une grande importance a la
                protection de vos donnees personnelles. La presente politique de
                confidentialite a pour objectif de vous informer sur la maniere
                dont nous collectons, utilisons et protegeons vos informations
                personnelles, conformement au Reglement General sur la Protection
                des Donnees (RGPD) et a la loi Informatique et Libertes.
              </p>
            </section>

            {/* Responsable du traitement */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Responsable du traitement
              </h2>
              <p>
                Le responsable du traitement des donnees personnelles est :
              </p>
              <ul className="mt-3 space-y-1">
                <li>Xyrelthium SAS</li>
                <li>42 rue de l&apos;Innovation, 75001 Paris, France</li>
                <li>Email : privacy@xyrelthium.com</li>
              </ul>
            </section>

            {/* Donnees collectees */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Donnees collectees
              </h2>
              <p>
                Nous collectons les categories de donnees suivantes :
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>
                  <span className="text-white">Donnees d&apos;identification :</span>{' '}
                  nom, prenom, adresse email, adresse postale, numero de
                  telephone
                </li>
                <li>
                  <span className="text-white">Donnees de commande :</span>{' '}
                  historique des achats, adresses de livraison, montants des
                  transactions
                </li>
                <li>
                  <span className="text-white">Donnees de connexion :</span>{' '}
                  adresse IP, type de navigateur, pages visitees, date et heure
                  de connexion
                </li>
                <li>
                  <span className="text-white">Donnees de paiement :</span>{' '}
                  les informations bancaires sont traitees exclusivement par
                  notre prestataire Stripe et ne sont jamais stockees sur nos
                  serveurs
                </li>
              </ul>
            </section>

            {/* Finalites */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Finalites du traitement
              </h2>
              <p>Vos donnees personnelles sont collectees pour les finalites suivantes :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Gestion de votre compte client et authentification</li>
                <li>Traitement et suivi de vos commandes</li>
                <li>Gestion des paiements et de la facturation</li>
                <li>Communication relative a vos commandes (confirmations, suivi de livraison)</li>
                <li>Envoi de newsletters et offres commerciales (avec votre consentement)</li>
                <li>Amelioration de nos services et de l&apos;experience utilisateur</li>
                <li>Respect de nos obligations legales et reglementaires</li>
              </ul>
            </section>

            {/* Base legale */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Base legale du traitement
              </h2>
              <p>Le traitement de vos donnees repose sur :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>
                  <span className="text-white">L&apos;execution du contrat :</span>{' '}
                  traitement des commandes, livraison, service apres-vente
                </li>
                <li>
                  <span className="text-white">Votre consentement :</span>{' '}
                  envoi de communications commerciales, cookies non essentiels
                </li>
                <li>
                  <span className="text-white">L&apos;interet legitime :</span>{' '}
                  amelioration de nos services, prevention de la fraude
                </li>
                <li>
                  <span className="text-white">L&apos;obligation legale :</span>{' '}
                  conservation des factures, obligations fiscales
                </li>
              </ul>
            </section>

            {/* Duree de conservation */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Duree de conservation
              </h2>
              <p>
                Vos donnees personnelles sont conservees pour la duree
                strictement necessaire aux finalites pour lesquelles elles sont
                traitees :
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Donnees de compte client : pendant la duree de la relation commerciale, puis 3 ans apres le dernier contact</li>
                <li>Donnees de commande : 5 ans a compter de la fin de l&apos;exercice comptable (obligation legale)</li>
                <li>Donnees de connexion : 12 mois maximum</li>
                <li>Consentement aux newsletters : jusqu&apos;au retrait du consentement</li>
              </ul>
            </section>

            {/* Destinataires */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Destinataires des donnees
              </h2>
              <p>
                Vos donnees personnelles peuvent etre transmises aux
                destinataires suivants :
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Nos equipes internes (service client, logistique)</li>
                <li>Notre prestataire de paiement : Stripe (certifie PCI-DSS)</li>
                <li>Notre hebergeur : Vercel Inc. (donnees hebergees en Europe)</li>
                <li>Notre base de donnees : Supabase (infrastructure securisee)</li>
                <li>Les transporteurs pour la livraison de vos commandes</li>
              </ul>
              <p className="mt-2">
                Nous ne vendons jamais vos donnees personnelles a des tiers.
              </p>
            </section>

            {/* Transferts hors UE */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Transferts hors Union Europeenne
              </h2>
              <p>
                Certains de nos prestataires sont situes en dehors de l&apos;Union
                Europeenne. Dans ce cas, nous nous assurons que des garanties
                appropriees sont mises en place (clauses contractuelles types de
                la Commission europeenne, certification Privacy Shield ou
                equivalent).
              </p>
            </section>

            {/* Droits */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Vos droits
              </h2>
              <p>
                Conformement au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>
                  <span className="text-white">Droit d&apos;acces :</span>{' '}
                  obtenir la confirmation que vos donnees sont traitees et en
                  recevoir une copie
                </li>
                <li>
                  <span className="text-white">Droit de rectification :</span>{' '}
                  corriger vos donnees inexactes ou incompletes
                </li>
                <li>
                  <span className="text-white">Droit a l&apos;effacement :</span>{' '}
                  demander la suppression de vos donnees
                </li>
                <li>
                  <span className="text-white">Droit a la limitation :</span>{' '}
                  restreindre le traitement de vos donnees
                </li>
                <li>
                  <span className="text-white">Droit a la portabilite :</span>{' '}
                  recevoir vos donnees dans un format structure et lisible
                </li>
                <li>
                  <span className="text-white">Droit d&apos;opposition :</span>{' '}
                  vous opposer au traitement de vos donnees pour des motifs
                  legitimes
                </li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous a :{' '}
                <span className="text-violet-400">privacy@xyrelthium.com</span>
              </p>
              <p className="mt-2">
                Vous disposez egalement du droit d&apos;introduire une
                reclamation aupres de la CNIL (Commission Nationale de
                l&apos;Informatique et des Libertes).
              </p>
            </section>

            {/* Securite */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Securite des donnees
              </h2>
              <p>
                Nous mettons en oeuvre des mesures techniques et
                organisationnelles appropriees pour proteger vos donnees
                personnelles contre tout acces non autorise, modification,
                divulgation ou destruction. Ces mesures incluent :
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Chiffrement des donnees en transit (HTTPS/TLS)</li>
                <li>Chiffrement des donnees au repos</li>
                <li>Controles d&apos;acces stricts aux bases de donnees</li>
                <li>Surveillance et journalisation des acces</li>
                <li>Mises a jour regulieres de securite</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Cookies
              </h2>
              <p>
                Notre site utilise des cookies pour assurer son bon
                fonctionnement et ameliorer votre experience de navigation :
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>
                  <span className="text-white">Cookies essentiels :</span>{' '}
                  session d&apos;authentification, panier d&apos;achat,
                  preferences de securite
                </li>
                <li>
                  <span className="text-white">Cookies analytiques :</span>{' '}
                  mesure d&apos;audience anonymisee pour ameliorer nos services
                </li>
              </ul>
              <p className="mt-2">
                Vous pouvez configurer votre navigateur pour refuser les cookies
                ou etre averti lorsqu&apos;un cookie est depose.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                Modifications de la politique
              </h2>
              <p>
                Nous nous reservons le droit de modifier la presente politique de
                confidentialite a tout moment. Toute modification sera publiee
                sur cette page avec une date de mise a jour actualisee. Nous vous
                invitons a consulter regulierement cette page.
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
