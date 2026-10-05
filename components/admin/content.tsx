"use client";

import { useEffect, useRef, useState } from "react";
import { I } from "@/lib/icons";
import { Btn, ImageField, MediaPicker, NumberField, TextArea, TextField, Toggle } from "@/components/fields";
import type { MediaItem, SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";
import { mergeContent } from "@/lib/mergeContent";

export function AdminContent({ content, setContent, media, onToast }: { content: SiteContent; setContent: SetContent; media: MediaItem[]; onToast: ToastFn }) {
  const [draft, setDraft] = useState(content);
  const [pickerFor, setPickerFor] = useState<any>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(content); }, [content]);

  const save = () => { setContent(draft); onToast("Contenu enregistré"); };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `contenu-site-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    onToast("Contenu exporté");
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setDraft(mergeContent(parsed));
        onToast("Contenu importé — pensez à enregistrer");
      } catch {
        onToast("Fichier JSON invalide");
      }
    };
    reader.readAsText(file);
  };

  const updateHero = (k: any, v: any) => setDraft({ ...draft, hero: { ...draft.hero, [k]: v } });
  const updateCta = (k: any, v: any) => setDraft({ ...draft, cta: { ...draft.cta, [k]: v } });
  const updateContact = (k: any, v: any) => setDraft({ ...draft, contact: { ...draft.contact, [k]: v } });
  const updateBrand = (k: any, v: any) => setDraft({ ...draft, brand: { ...draft.brand, [k]: v } });
  const updateAdvantage = (i: any, v: any) => { const arr = [...draft.hero.advantages]; arr[i] = { ...arr[i], label: v }; setDraft({ ...draft, hero: { ...draft.hero, advantages: arr } }); };
  const updateStep = (i: any, k: any, v: any) => { const arr = [...draft.steps]; arr[i] = { ...arr[i], [k]: v }; setDraft({ ...draft, steps: arr }); };
  const updatePillar = (i: any, k: any, v: any) => { const arr = [...draft.pillars]; arr[i] = { ...arr[i], [k]: v }; setDraft({ ...draft, pillars: arr }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Contenu du site</h1>
          <p className="text-[14px] text-slate-500 mt-1">Modifiez tous les textes et images du site sans toucher au code.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Btn variant="outline" icon={I.upload("w-4 h-4 rotate-180")} onClick={exportJson}>Exporter JSON</Btn>
          <Btn variant="outline" icon={I.upload("w-4 h-4")} onClick={() => importRef.current?.click()}>Importer JSON</Btn>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJson(f);
              e.target.value = "";
            }}
          />
          <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer les modifications</Btn>
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <h2 className="text-[15px] font-bold text-slate-900">Section Hero</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageField label="Image principale" value={draft.hero.image} onChange={(v) => updateHero("image", v)} onOpenLibrary={() => setPickerFor("hero")} aspect="aspect-[16/10]" />
          <div className="space-y-4">
            <TextField label="Titre ligne 1" value={draft.hero.title1} onChange={(v) => updateHero("title1", v)} />
            <TextField label="Titre ligne 2" value={draft.hero.title2} onChange={(v) => updateHero("title2", v)} />
            <TextField label="Prix affiché" value={draft.hero.price} onChange={(v) => updateHero("price", v)} />
          </div>
          <div className="sm:col-span-2"><TextArea label="Sous-titre" value={draft.hero.subtitle} onChange={(v) => updateHero("subtitle", v)} rows={2} /></div>
          <div className="sm:col-span-2 grid sm:grid-cols-3 gap-3">
            {draft.hero.advantages.map((a, i) => (<TextField key={i} label={`Avantage ${i + 1}`} value={a.label} onChange={(v) => updateAdvantage(i, v)} />))}
          </div>
          {/* Réglages de l'animation typewriter */}
<div className="sm:col-span-2 bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center">{I.spark("w-4 h-4")}</div>
    <div>
      <h3 className="text-[14px] font-bold text-slate-900">Animation du titre (typewriter)</h3>
      <p className="text-[12px] text-slate-500">Réglage de la vitesse et des pauses</p>
    </div>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <NumberField
      label="Vitesse de frappe"
      value={draft.hero.typewriter?.typingSpeed || 35}
      onChange={(v) => updateHero("typewriter", { ...(draft.hero.typewriter || {}), typingSpeed: v })}
      min={10} max={200} step={5}
      hint="ms par caractère — plus bas = plus rapide"
      recommended="35"
    />
    <NumberField
      label="Vitesse d'effacement"
      value={draft.hero.typewriter?.erasingSpeed || 15}
      onChange={(v) => updateHero("typewriter", { ...(draft.hero.typewriter || {}), erasingSpeed: v })}
      min={5} max={100} step={5}
      hint="ms par caractère — plus bas = plus rapide"
      recommended="15"
    />
    <NumberField
      label="Pause entre les 2 lignes"
      value={draft.hero.typewriter?.pauseBetweenLines || 100}
      onChange={(v) => updateHero("typewriter", { ...(draft.hero.typewriter || {}), pauseBetweenLines: v })}
      min={0} max={1000} step={50}
      hint="ms d'attente après la 1ère ligne"
      recommended="100"
    />
    <NumberField
      label="Durée d'affichage complet"
      value={draft.hero.typewriter?.holdDuration || 3000}
      onChange={(v) => updateHero("typewriter", { ...(draft.hero.typewriter || {}), holdDuration: v })}
      min={500} max={15000} step={250}
      hint="ms de pause quand la phrase est complète"
      recommended="3000"
    />
    <NumberField
      label="Pause avant effacement"
      value={draft.hero.typewriter?.pauseBeforeErasing || 200}
      onChange={(v) => updateHero("typewriter", { ...(draft.hero.typewriter || {}), pauseBeforeErasing: v })}
      min={0} max={2000} step={50}
      hint="ms avant de commencer à effacer"
      recommended="200"
    />
  </div>

  {/* Aperçu du rendu */}
  <div className="bg-white rounded-xl p-4 ring-1 ring-slate-200">
    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Aperçu du rythme</p>
    <p className="text-[13px] text-slate-600 leading-relaxed">
      Une phrase typique (20 caractères) s'écrit en environ{" "}
      <strong className="text-[#1E9BE0]">
        {((draft.hero.typewriter?.typingSpeed || 35) * 20 / 1000).toFixed(1)} s
      </strong>{" "}
      puis reste affichée{" "}
      <strong className="text-[#1E9BE0]">
        {((draft.hero.typewriter?.holdDuration || 3000) / 1000).toFixed(1)} s
      </strong>{" "}
      avant de s'effacer.
    </p>
  </div>
</div>
          <TextField label="CTA principal" value={draft.hero.ctaPrimary} onChange={(v) => updateHero("ctaPrimary", v)} />
          <TextField label="CTA secondaire" value={draft.hero.ctaSecondary} onChange={(v) => updateHero("ctaSecondary", v)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <h2 className="text-[15px] font-bold text-slate-900">Section « Pourquoi nous choisir »</h2>
        <ImageField label="Image de la section À propos" value={draft.whyUsImage} onChange={(v) => setDraft({ ...draft, whyUsImage: v })} onOpenLibrary={() => setPickerFor("whyUs")} aspect="aspect-[16/10]" />
        <div className="grid sm:grid-cols-2 gap-3">
          {draft.pillars.map((p, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 space-y-2">
              <TextField label={`Pilier ${i + 1} — titre`} value={p.title} onChange={(v) => updatePillar(i, "title", v)} />
              <TextField label="Description" value={p.desc} onChange={(v) => updatePillar(i, "desc", v)} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <h2 className="text-[15px] font-bold text-slate-900">Section « Comment ça marche »</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {draft.steps.map((s, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 space-y-2">
              <TextField label={`Étape ${s.n} — titre`} value={s.title} onChange={(v) => updateStep(i, "title", v)} />
              <TextField label="Description" value={s.desc} onChange={(v) => updateStep(i, "desc", v)} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <h2 className="text-[15px] font-bold text-slate-900">Section CTA final</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageField label="Image de fond" value={draft.cta.image} onChange={(v) => updateCta("image", v)} onOpenLibrary={() => setPickerFor("cta")} aspect="aspect-[16/10]" />
          <div className="space-y-4">
            <TextArea label="Titre" value={draft.cta.title} onChange={(v) => updateCta("title", v)} rows={2} />
            <TextField label="Sous-titre" value={draft.cta.subtitle} onChange={(v) => updateCta("subtitle", v)} />
            <TextField label="Texte du bouton" value={draft.cta.button} onChange={(v) => updateCta("button", v)} />
          </div>
        </div>
      </div>

            <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <h2 className="text-[15px] font-bold text-slate-900">Coordonnées</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Téléphone" value={draft.contact.phone} onChange={(v) => updateContact("phone", v)} />
          <TextField label="WhatsApp (chiffres uniquement)" value={draft.contact.whatsapp} onChange={(v) => updateContact("whatsapp", v)} />
          <TextField label="Ville" value={draft.contact.city} onChange={(v) => updateContact("city", v)} />
          <TextField label="Horaires" value={draft.contact.hours} onChange={(v) => updateContact("hours", v)} />
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center shrink-0">
            {I.instagram("w-5 h-5")}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">Réseaux sociaux</h2>
            <p className="text-[12.5px] text-slate-500 mt-0.5">Laisse un champ vide pour masquer l'icône sur le site.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0">
              {I.facebook("w-5 h-5")}
            </div>
            <div className="flex-1">
              <TextField
                label="Facebook (URL complète)"
                value={draft.social?.facebook || ""}
                onChange={(v) => setDraft({ ...draft, social: { ...(draft.social || {}), facebook: v } })}
                placeholder="https://facebook.com/ecocleanexpert"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0">
              {I.instagram("w-5 h-5")}
            </div>
            <div className="flex-1">
              <TextField
                label="Instagram (URL complète)"
                value={draft.social?.instagram || ""}
                onChange={(v) => setDraft({ ...draft, social: { ...(draft.social || {}), instagram: v } })}
                placeholder="https://instagram.com/ecocleanexpert"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
              {I.tiktok("w-5 h-5")}
            </div>
            <div className="flex-1">
              <TextField
                label="TikTok (URL complète)"
                value={draft.social?.tiktok || ""}
                onChange={(v) => setDraft({ ...draft, social: { ...(draft.social || {}), tiktok: v } })}
                placeholder="https://tiktok.com/@ecocleanexpert"
              />
            </div>
          </div>
        </div>

        {/* Aperçu */}
        {(draft.social?.facebook || draft.social?.instagram || draft.social?.tiktok) && (
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Aperçu</p>
            <div className="flex items-center gap-2.5">
              {draft.social?.facebook && (
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                  {I.facebook("w-5 h-5")}
                </div>
              )}
              {draft.social?.instagram && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center">
                  {I.instagram("w-5 h-5")}
                </div>
              )}
              {draft.social?.tiktok && (
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  {I.tiktok("w-5 h-5")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <h2 className="text-[15px] font-bold text-slate-900">Marque</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Nom de l'entreprise" value={draft.brand.name} onChange={(v) => updateBrand("name", v)} />
          <TextField label="Slogan" value={draft.brand.tagline} onChange={(v) => updateBrand("tagline", v)} />
        </div>
        <ImageField label="Logo" value={draft.brand.logo} onChange={(v) => updateBrand("logo", v)} onOpenLibrary={() => setPickerFor("logo")} />
      </div>
      {/* Entreprise parente */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A2A6B] text-white flex items-center justify-center shrink-0">
            {I.shield("w-5 h-5")}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">Entreprise du groupe</h2>
            <p className="text-[12.5px] text-slate-500 mt-0.5">
              Si Eco Clean Expert est une branche d'une société plus large, renseignez-la ici. Cela évite la confusion quand les clients voient le nom sur les reçus et factures.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label="Nom de la société mère"
            value={draft.parentCompany?.name || ""}
            onChange={(v) => setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), name: v } })}
            placeholder="Ex : JULMARKETING Corporation"
          />
          <TextField
            label="Forme juridique"
            value={draft.parentCompany?.legalForm || ""}
            onChange={(v) => setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), legalForm: v } })}
            placeholder="Ex : Sarl U"
          />
          <TextField
            label="Qualificatif"
            value={draft.parentCompany?.tagline || ""}
            onChange={(v) => setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), tagline: v } })}
            placeholder="Ex : Entreprise multisectorielle"
          />
        </div>

        <TextArea
          label="Présentation du groupe"
          value={draft.parentCompany?.shortIntro || ""}
          onChange={(v) => setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), shortIntro: v } })}
          placeholder="Ex : Eco Clean Expert est une marque du groupe JULMARKETING Corporation..."
          rows={3}
        />

        <ImageField
          label="Logo du groupe (pour la section publique)"
          value={draft.parentCompany?.logo || ""}
          onChange={(v) => setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), logo: v } })}
          onOpenLibrary={() => setPickerFor("parentLogo")}
          hint="PNG fond transparent recommandé"
        />

        <div>
          <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">
            Domaines d'activité du groupe (un par ligne)
          </label>
          <textarea
            value={(draft.parentCompany?.branches || []).join("\n")}
            onChange={(e) => setDraft({
              ...draft,
              parentCompany: {
                ...(draft.parentCompany || {}),
                branches: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              },
            })}
            rows={4}
            placeholder={"Nettoyage professionnel\nCommerce général\nServices aux entreprises"}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px] bg-white resize-y"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Le premier domaine est mis en avant (vert). Les autres apparaissent en gris.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
          <Toggle
            checked={draft.parentCompany?.showInFooter !== false}
            onChange={(v) => setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), showInFooter: v } })}
            label="Afficher la mention dans le footer"
          />
          <Toggle
            checked={draft.parentCompany?.showInAbout !== false}
            onChange={(v) => setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), showInAbout: v } })}
            label="Afficher la section « Notre groupe » sur le site"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Btn variant="primary" size="lg" icon={I.save("w-5 h-5")} onClick={save}>Enregistrer les modifications</Btn>
      </div>

      <MediaPicker open={pickerFor !== null} onClose={() => setPickerFor(null)} media={media} onPick={(url) => {
                if (pickerFor === "hero") updateHero("image", url);
        else if (pickerFor === "whyUs") setDraft({ ...draft, whyUsImage: url });
        else if (pickerFor === "cta") updateCta("image", url);
        else if (pickerFor === "logo") updateBrand("logo", url);
        else if (pickerFor === "parentLogo") setDraft({ ...draft, parentCompany: { ...(draft.parentCompany || {}), logo: url } });
      }} />
    </div>
  );
}

/* ============================================================
   ADMIN MÉDIATHÈQUE
============================================================ */
